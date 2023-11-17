import React, { useEffect, useState } from 'react';
import BaseLayout from "@/pages/Sidebar/BaseLayout";
import IconButton from '@mui/material/IconButton';
import { TextField, InputAdornment, MenuItem } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getFirestore, collection, query, onSnapshot, deleteDoc, doc, updateDoc, where, getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/config";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const MONTHS: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export interface TableData {
  id: string;
  name: string;
  cedula: string;
  estado: string;
  fechaIngreso?: string;
  proximoPago?: string;
  member?: string;
}

export default function ReportPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [numClientesDeshabilitados, setNumClientesDeshabilitados] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [numClientesRecientes, setNumClientesRecientes] = useState(0);
  const [gananciaUltimoMes, setGananciaUltimoMes] = useState(0);
  const [gananciaUltimoAnio, setGananciaUltimoAnio] = useState([] as { month: string; ganancia: number }[]);
  const [newClientsData, setNewClientsData] = useState<{ month: string; newClients: number; }[]>([]);
  const [numClientesRegistrados, setNumClientesRegistrados] = useState(0);
  const [selectedEstado, setSelectedEstado] = useState<string>('todos'); // Estado inicial 'todos'
  const [stateClientesHabilitados, setStateClientesHabilitados] = useState(0);
  const [stateClientesDeshabilitados, setStateClientesDeshabilitados] = useState(0);

  useEffect(() => {
    const clientCollection = collection(db, 'cliente');
    const q = query(clientCollection);

    // Obtener fechas
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastYearDate = new Date();
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);

    // Crea un oyente en tiempo real para la colección de clientes
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const data = querySnapshot.docs.map(async (doc) => {
        const { nombre, primerApellido, correo, estado } = doc.data();
        return {
          id: doc.id,
          name: `${nombre} ${primerApellido}`,
          mail: correo,
          estado: estado,
          lastName: doc.data().primerApellido,
          secondLastName: doc.data().segundoApellido,
          cedula: doc.data().cedula,
          birthDate: doc.data().fechaNacimiento,
          phone: doc.data().telefono,
          gender: doc.data().sexo,
        };
      });
      const resolvedData = await Promise.all(data);
      const filteredData = resolvedData.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.cedula.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setTableData(filteredData);

      // Contar todos los clientes registrados
      setNumClientesRegistrados(resolvedData.length);

      // Contar clientes Deshabilitados
      const numDeshabilitados = resolvedData.filter((client) => client.estado === 'Deshabilitado').length;
      setNumClientesDeshabilitados(numDeshabilitados);

      const filteredState = filterData(resolvedData);

      setTableData(filteredState);

      // Contar clientes habilitados y Deshabilitados
      const stateHabilitados = filteredState.filter((client) => client.estado === 'Habilitado').length;
      setStateClientesHabilitados(stateHabilitados);

      const stateDeshabilitados = filteredData.filter((client) => client.estado === 'Deshabilitado').length;
      setStateClientesDeshabilitados(stateDeshabilitados);
    });

    const fetchDataIngresos = async () => {
      const membershipCollection = collection(db, 'clienteMembresia');
      const membershipQ = query(membershipCollection);
      const querySnapshot = await getDocs(membershipQ);
      const data = querySnapshot.docs.map(async (doc) => {
        const { clienteId, fechaIngreso } = doc.data();

        // Obtener la fecha de ingreso del cliente
        const clientDate = new Date(fechaIngreso); // Suponiendo que la fechaIngreso es un objeto Date en Firestore

        return {
          clienteId,
          admDate: clientDate,
        };
      });
      const resolvedData = await Promise.all(data);

      // Filtrar los clientes ingresados en el último mes
      const numRecientes = resolvedData.filter((client) => client.admDate >= firstDayOfMonth && client.admDate <= currentDate).length;
      setNumClientesRecientes(numRecientes);

      const newClientsQuerySnapshot = await getDocs(membershipCollection);
      const newClientsData: { [key: string]: number } = {};

      newClientsQuerySnapshot.docs.map((doc) => {
        const { fechaIngreso } = doc.data();
        const clientDate = new Date(fechaIngreso);

        const month: string = MONTHS[clientDate.getMonth() as number];

        // Verificar si ya hemos contado un cliente nuevo para este mes
        if (!newClientsData[month]) {
          newClientsData[month] = 1; // Contar al cliente nuevo
        } else {
          newClientsData[month] += 1; // Ya hemos contado un cliente, así que incrementar el contador
        }
      });
      const formattedNewClientsData = MONTHS.map((month) => ({
        month,
        newClients: newClientsData[month],
      }));
      console.log(newClientsData);
      setNewClientsData(formattedNewClientsData);

    }
    const fetchData = async () => {
      const facturaCollection = collection(db, 'factura');
      const facturaQuery = query(facturaCollection);

      const querySnapshot = await getDocs(facturaQuery);
      const allData = querySnapshot.docs.map((doc) => doc.data());

      const filteredData = allData.filter((item) => {
        const paymentDate = new Date(item.fecha);
        return paymentDate >= lastYearDate && paymentDate <= currentDate;
      });

      const monthlyGains = Array(12).fill(0);

      filteredData.forEach((item) => {
        const paymentDate = new Date(item.fecha);
        const monthIndex = paymentDate.getMonth();
        monthlyGains[monthIndex] += parseFloat(item.total);
      });

      const formattedData = MONTHS.map((month, index) => ({
        month,
        ganancia: monthlyGains[index],
      }));
      const data = querySnapshot.docs.map(async (doc) => {
        const { total, fecha } = doc.data();

        const paymentDate = new Date(fecha);

        if (paymentDate >= firstDayOfMonth && paymentDate <= currentDate) {
          return total; // Retornar el monto de la factura para sumarlo luego
        }
        return 0;
      });

      const resolvedData = await Promise.all(data);

      // Convertir los montos a números antes de sumarlos
      const montosNumeros = resolvedData.map((monto) => parseFloat(monto));
      const montosValidos = montosNumeros.filter((monto) => !isNaN(monto));
      // Sumar los montos de las facturas pagadas del último mes
      const gananciaUltimoMes = montosValidos.reduce((total, monto) => total + monto, 0);
      setGananciaUltimoMes(gananciaUltimoMes);

      setGananciaUltimoAnio(formattedData);
    };

    fetchData();
    fetchDataIngresos();
    // Limpiar el oyente cuando el componente se desmonta   
    return () => {
      unsubscribe();
    };

  }, [app, searchQuery, selectedEstado]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEstadoChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedEstado(event.target.value as string);
  };

  const filterData = (data: TableData[]) => {
    if (selectedEstado === 'todos') {
     // Filtrar por nombre o cédula si se proporciona una cadena de búsqueda
    return data.filter((client) =>
    (client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.cedula.toLowerCase().includes(searchQuery.toLowerCase()))
  );
    } else {
      return data.filter((client) => client.estado.toLowerCase() === selectedEstado);
    }
  };


  return (
    <BaseLayout>
      <div className='container-report'>
        <div className='container-repot-ganancia'>
          <div className="graph">
            <h1 className='textGanancia'>Ganancias</h1>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={gananciaUltimoAnio} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ganancia" fill="#2b8c8c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="Ganancias">
            <img className="enabled" src="/img/money.png" />
            <p className='text1'>{gananciaUltimoMes}</p>
            <h1 className='text2H'>Ganancias Del Mes</h1>
          </div>
        </div>
        <div className='container-repot-ganancia'>
          <div className="graph2">
          <h1 className='textClientes'>Clientes</h1>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={newClientsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="newClients" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="Ingresos">
            <img className="enabled" src="/img/enabled.png" />
            <p className='text1'>{numClientesRecientes}</p>
            <h1 className='text2H'>Ingresos Del Mes</h1>
          </div>
        </div>
        <div className="Cancelar">
          <img className="disabled" src="/img/disabled.png" />
          <p className='text1'>{numClientesDeshabilitados}</p>
          <h1 className='text2D'>Desabilitados</h1>
        </div>
        <div className="Clientes">
          <img className="enabled" src="/img/allClients.png" />
          <p className='text1'>{numClientesRegistrados}</p>
          <h1 className='text2H'>Total de Clientes</h1>
        </div>

        <div className='buscador'>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="SearchIcon" />
                </InputAdornment>
              ),
            }}
            placeholder="Buscar Nuevos"
            sx={{
              width: '50%',
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2b8c8c',
              },
              marginLeft: '2%',
              marginRight: '10%',
            }}
            value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
          <TextField
            select
            label="Filtrar por Estado"
            value={selectedEstado}
            onChange={handleEstadoChange}
            sx={{
              width: '30%',
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2b8c8c',
              },
              marginRight: '30px',
            }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="habilitado">Habilitados</MenuItem>
            <MenuItem value="deshabilitado">Deshabilitados</MenuItem>
          </TextField>
        </div>
      </div>
      <div className="container-table-report">
        <table className="report-table">
          <thead>
            <tr className="fixed-header-row">
              <th className="th-tableReport">Cedula</th>
              <th className="th-tableReport">Nombre</th>
              <th className="th-tableReport">Estado</th>
              <th className="th-tableReport">Acción</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((client) => (
                <tr key={client.id} className="tableReport-row">
                  <td>{client.cedula}</td>
                  <td>{client.name}</td>
                  <td>{client.estado}</td>
                  <td>
                    <Link href={`/ViewClient?id=${client.id}`}>
                      <VisibilityIcon className="email-icon" />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <span className="show-text">Mostrar</span>
          <select value={rowsPerPage} onChange={handleChangeRowsPerPage} className="select-element">
            {[5, 10, 25].map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pagination-controls">
            <IconButton
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="pagination-button"
              style={{ color: page === 0 ? 'grey' : '#A1A626' }}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <span className="pagination-page">{page + 1}</span>
            <IconButton
              disabled={page >= Math.ceil(tableData.length / rowsPerPage) - 1}
              onClick={() => setPage(page + 1)}
              className="pagination-button"
              style={{ color: page >= Math.ceil(tableData.length / rowsPerPage) - 1 ? 'grey' : '#A1A626' }}
            >
              <NavigateNextIcon />
            </IconButton>
          </div>
        </div>
      </div>

    </BaseLayout>
  );
}