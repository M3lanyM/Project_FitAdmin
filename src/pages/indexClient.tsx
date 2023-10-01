import React, { useState, useEffect } from 'react';
import BaseLayout from "@/pages/Sidebar/BaseLayout";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { TextField, InputAdornment, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/config";
import ModalAddClient from '@/components/ModalAddCliend';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


export interface TableData {
  id: string;
  name: string;
  mail: string;
  state: string;
}

export default function ClientPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    async function fetchFirebaseData() {
      const db = getFirestore(app);
      const clientCollection = collection(db, 'cliente');

      try {
        const querySnapshot = await getDocs(clientCollection);
        const data = querySnapshot.docs.map((doc) => {
          const { nombre, primerApellido, correo, estado } = doc.data();
          return {
            id: doc.id,
            name: `${nombre} ${primerApellido}`,
            mail: correo,
            state: estado,
          };
        });
        setTableData(data);
      } catch (error) {
        console.error('Error al obtener datos de Firebase:', error);
      }
    }

    fetchFirebaseData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const activeClientsCount = calculateActiveClientsCount();
  const deactiveClientsCount = calculateDeactivateClientsCount();

  function calculateActiveClientsCount() {
    const activeClients = tableData.filter(client => client.state === 'Activo');
    return activeClients.length;
  }

  function calculateDeactivateClientsCount() {
    const deactivateClients = tableData.filter(client => client.state === 'Inactivo');
    return deactivateClients.length;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <BaseLayout>
      <div className='hClient'>
        <div className='ContaH'>
          <button onClick={openModal} className='btnClient'>
            + Agregar Cliente
          </button>

          <div className='Descarga'>
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="SearchIcon" />
                  </InputAdornment>
                ),
              }}
              placeholder="Buscar cliente"
              sx={{
                width: '85%',
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2b8c8c',
                },
                marginRight: '30px',
              }}
            />
            <Button
              variant="outlined"
              startIcon={<CloudDownloadIcon className="custom-icon" />}
              sx={{
                width: '30%',
                color: '#2b8c8c',
                fontWeight: 'bold',
                borderColor: '#2b8c8c',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#2b8c8c',
                  borderWidth: 2,
                },
              }}
            >
              Excel
            </Button>
          </div>
        </div>

        <div className="Habilitados">
          <img className="enabled" src="/img/enabled.png" />
          <p className='text1'>{`${activeClientsCount}`}</p>
          <h1 className='text2H'>Habilitados</h1>
        </div>

        <div className="Deshabilitados">
          <img className="disabled" src="/img/disabled.png" />
          <p className='text1'>{`${deactiveClientsCount}`}</p>
          <h1 className='text2D'>Deshabilitados</h1>
        </div>
      </div>

      <div className="tableClient-container">
        <table className="tableClient">
          <thead>
            <tr className="fixed-header-row">
              <th className="th-tableClient">Nombre</th>
              <th className="th-tableClient">Correo</th>
              <th className="th-tableClient">Estado</th>
              <th className="th-tableClient">Acción</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((client) => (
                <tr key={client.id} className="tableClient-row">
                  <td>{client.name}</td>
                  <td>{client.mail}</td>
                  <td>{client.state}</td>
                  <td>
                    <EmailIcon className="email-icon" />
                    <DeleteIcon className="delete-icon" />
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

      {isModalOpen && <ModalAddClient onClose={closeModal} />}
    </BaseLayout>
  );
}
