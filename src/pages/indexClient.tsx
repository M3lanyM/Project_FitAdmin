import { useEffect, useState } from "react";
import BaseLayout from "@/pages/Sidebar/BaseLayout";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { TextField, InputAdornment, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getFirestore, collection, query, onSnapshot, deleteDoc, doc, updateDoc, where, getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/config";
import ModalAddClient from '@/components/ModalAddCliend';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';

import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import React from "react";

export interface TableData {
  id: string;
  name: string;
  lastName: string;
  secondLastName: string;
  cedula: string;
  birthDate: string;
  mail: string;
  phone: string;
  estado: string;
  gender: string;
  fechaIngreso?: string;
  proximoPago?: string;
  member?: string;
}


export default function ClientPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState('');
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedClient, setSelectedClient] = useState<TableData | null>(null);
  const [numClientesHabilitados, setNumClientesHabilitados] = useState(0);
  const [numClientesDeshabilitados, setNumClientesDeshabilitados] = useState(0);

  useEffect(() => {
    const clientCollection = collection(db, 'cliente');
    const q = query(clientCollection);

    // Crea un oyente en tiempo real para la colección de clientes
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
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
      setTableData(data);


      // Contar clientes habilitados y Deshabilitados
      const numHabilitados = data.filter((client) => client.estado === 'Habilitado').length;
      setNumClientesHabilitados(numHabilitados);
      numClientesDeshabilitados

      const numDeshabilitados = data.filter((client) => client.estado === 'Deshabilitado').length;
      setNumClientesDeshabilitados(numDeshabilitados);

    });

    //trae los datos de la membrecia y el precio de esa membresia
    const fetchMembershipTypes = async () => {
      const membershipCollection = collection(db, "membresia");
      const membershipQuery = query(membershipCollection);
      const membershipSnapshot = await getDocs(membershipQuery);

      const membershipTypes: { [key: string]: number } = {};
      membershipSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.tipo && data.precio) {
          membershipTypes[data.tipo] = data.precio;
        }
      });

      setMembershipOptions([" ", ...Object.keys(membershipTypes)]);
    };

    fetchMembershipTypes();

    // Limpiar el oyente cuando el componente se desmonta   
    return () => {
      unsubscribe();
    };
  }, [app]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //eliminar cliente
  const deleteClient = async (clientId: string) => {
    setIsDeleteModalOpen(true);
    setClientIdToDelete(clientId);
  };



  const confirmDelete = async () => {
    try {
      const db = getFirestore(app);
      const clientRef = doc(db, 'cliente', clientIdToDelete);

      // Eliminar el cliente de la colección "cliente"
      await deleteDoc(clientRef);

      // Eliminar los datos de "clienteMembresia" asociados al cliente
      const clienteMembresiaCollection = collection(db, 'clienteMembresia');
      const q = query(clienteMembresiaCollection, where('clienteId', '==', doc(db, 'cliente', clientIdToDelete)));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const clienteMembresiaDoc = querySnapshot.docs[0];
        const clienteMembresiaRef = doc(db, 'clienteMembresia', clienteMembresiaDoc.id);
        await deleteDoc(clienteMembresiaRef);
      }

      setTableData((prevData) => prevData.filter((client) => client.id !== clientIdToDelete));

      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  //editar cliente (modal)
  const editClient = async (client: TableData) => {
    try {
      const clienteMembresiaCollection = collection(db, 'clienteMembresia');
      const q = query(clienteMembresiaCollection, where('clienteId', '==', doc(db, 'cliente', client.id)));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Manejar el caso en el que no se encuentre ningún documento coincidente en clienteMembresia
        console.log('No se encontró ningún documento coincidente en clienteMembresia');
        return;
      }

      const clienteMembresiaDoc = querySnapshot.docs[0].data();

      // Divide el nombre en nombre y apellido
      const [primerNombre] = client.name.split(' ');

      setSelectedClient({
        ...client,
        name: primerNombre, // Establecer solo el primer nombre
        fechaIngreso: clienteMembresiaDoc.fechaIngreso,
        proximoPago: clienteMembresiaDoc.proximoPago,
        member: clienteMembresiaDoc.id,

      });

      setShowModalEdit(true);
    } catch (error) {
      console.error('Error al obtener los datos de clienteMembresia:', error);
    }

  };


  const [membershipOptions, setMembershipOptions] = useState<string[]>([]);


  const saveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) {
      console.error('No se ha seleccionado ningún cliente.');
      return;
    }

    try {
      const db = getFirestore(app);
      const clientRef = doc(db, 'cliente', selectedClient.id);
      await updateDoc(clientRef, {
        nombre: selectedClient.name,
        primerApellido: selectedClient.lastName,
        segundoApellido: selectedClient.secondLastName,
        cedula: selectedClient.cedula,
        fechaNacimiento: selectedClient.birthDate,
        correo: selectedClient.mail,
        telefono: selectedClient.phone,
        estado: selectedClient.estado,
        sexo: selectedClient.gender,
      });

      const clienteMembresiaCollection = collection(db, 'clienteMembresia');
      const q = query(clienteMembresiaCollection, where('clienteId', '==', doc(db, 'cliente', selectedClient.id)));
      const querySnapshot = await getDocs(q);

      let membershipRef = null;
      const membershipCollection = collection(db, "membresia");
      const membershipQuery = query(
        membershipCollection,
        where("tipo", "==", selectedClient.member) // Consulta la membresía con el nombre seleccionado
      );
      const membershipSnapshot = await getDocs(membershipQuery);

      if (!membershipSnapshot.empty) {
        membershipSnapshot.forEach((doc) => {
          membershipRef = doc.ref; // Obtén la referencia al documento de membresía
        });
      } else {
        console.error("No se encontró la membresía seleccionada.");
        return;
      }

      if (!querySnapshot.empty) {
        const clienteMembresiaDoc = querySnapshot.docs[0];
        const clienteMembresiaRef = doc(db, 'clienteMembresia', clienteMembresiaDoc.id);
        await updateDoc(clienteMembresiaRef, {
          fechaIngreso: selectedClient.fechaIngreso,
          proximoPago: selectedClient.proximoPago,
          membershipId: membershipRef,
        });
      }

      updateClientInTableData(selectedClient);

      setShowModalEdit(false);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const updateClientInTableData = (updatedClient: TableData) => {
    setTableData((prevData) =>
      prevData.map((client) => {
        if (client.id === updatedClient.id) {
          const fullName = `${updatedClient.name} ${updatedClient.lastName}`;
          return {
            ...updatedClient,
            name: fullName,
          };
        } else {
          return client;
        }
      })
    );
  };

  const viewClient = (client: TableData) => {
    // Crear un nuevo objeto con solo el nombre del cliente
    const viewClients = {
      ...client,
      name: client.id.split(' ')[0], // Tomar solo el primer nombre
    };
    setSelectedClient(viewClients);
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
          <p className='text1'>{numClientesHabilitados}</p>
          <h1 className='text2H'>Habilitados</h1>
        </div>

        <div className="Deshabilitados">
          <img className="disabled" src="/img/disabled.png" />
          <p className='text1'>{numClientesDeshabilitados}</p>
          <h1 className='text2D'>Deshabilitados</h1>
        </div>
      </div>

      <div className="tableClient-container">
        <table className="tableClient">
          <thead>
            <tr className="fixed-header-row">
              <th className="th-tableClient">Cedula</th>
              <th className="th-tableClient">Nombre</th>
              <th className="th-tableClient">Estado</th>
              <th className="th-tableClient">Acción</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((client) => (
                <tr key={client.id} className="tableClient-row">
                  <td>{client.cedula}</td>
                  <td>{client.name}</td>
                  <td>{client.estado}</td>
                  <td>
                    <EditIcon className="edit-icon"
                      onClick={() => editClient(client)} />


                    <Link href={`/ViewClient?id=${client.id}`}>
                      <VisibilityIcon className="email-icon" onClick={() => viewClient(client)} />
                    </Link>

                    <DeleteIcon
                      className="delete-icon"
                      onClick={() => deleteClient(client.id)}
                    />
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
      {isDeleteModalOpen && (
        <div className="modal-delete">
          <div className="custom-modal-delete">
            <p className='text-delete'>¿Estás seguro de que deseas eliminar este cliente?</p>
            <button className="confirmDelete" onClick={confirmDelete}>Sí</button>
            <button className="cancelDelete" onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}

      {showModalEdit && selectedClient && (
        <div className="modalEdit">
          <div className="modalEdit-content">
            <h2 className="personalInfo-title">DATOS PERSONALES</h2>
            <form onSubmit={saveChanges} className="form-grid">
              <div className="form-row">
                <label >Nombre:</label>
                <input
                  className="personalInfo"
                  type="text"
                  placeholder="Nombre"
                  value={selectedClient.name}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, name: e.target.value });
                  }}
                />
              </div>
              <div className="form-row">
                <label>Primer Apellido:</label>
                <input
                  className="personalInfo"
                  type="text"
                  placeholder="Primer Apellido"
                  value={selectedClient.lastName}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, lastName: e.target.value });
                  }}
                />
              </div>
              <div className="form-row">
                <label>Segundo Apellido:</label>
                <input
                  className="personalInfo"
                  type="text"
                  placeholder="Segundo Apellido"
                  value={selectedClient.secondLastName}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, secondLastName: e.target.value });
                  }}
                />
              </div>
              <div className="form-row">
                <label>Cedula:</label>
                <input
                  className="personalInfo"
                  type="text"
                  placeholder="Cedula"
                  value={selectedClient.cedula}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, cedula: e.target.value });
                  }}
                />
              </div>
              <div className="form-row">
                <label>Fecha de Nacimiento:</label>
                <input
                  className="personalInfo"
                  type="date"
                  placeholder="Fecha de Nacimiento"
                  value={selectedClient.birthDate}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, birthDate: e.target.value });
                  }}
                />
              </div>
              <div className="form-row">
                <label>Correo:</label>
                <input
                  className="personalInfo"
                  type="text"
                  placeholder="Correo"
                  value={selectedClient.mail}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, mail: e.target.value });
                  }}
                />
              </div>
              <div className="form-row">
                <label>Telefono:</label>
                <input
                  className="personalInfo"
                  type="text"
                  placeholder="Telefono"
                  value={selectedClient.phone}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, phone: e.target.value });
                  }}
                />
              </div>
              <div className="form-row">
                <label>Estado:</label>
                <select
                  className="personalInfo"
                  value={selectedClient.estado}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, estado: e.target.value });
                  }}
                >
                  <option value="Habilitado">Habilitado</option>
                  <option value="Deshabilitado">Deshabilitado</option>
                </select>
              </div>
              <div className="form-row">
                <label>Sexo:</label>
                <select
                  className="personalInfo"
                  value={selectedClient.gender}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, gender: e.target.value });
                  }}
                >
                  <option>Femenino</option>
                  <option>Masculino</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="form-row">
                <label>Membresia:</label>
                <select
                  className="inputformC1"
                  name="membership"
                  value={selectedClient.member}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, member: e.target.value });
                  }}
                >
                  {membershipOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Fecha Ingreso:</label>
                <input
                  className="personalInfo"
                  type="date"
                  value={selectedClient.fechaIngreso}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, fechaIngreso: e.target.value });
                  }} />
              </div>
              <div className="form-row">
                <label>Proximo pago:</label>
                <input
                  className="personalInfo"
                  type="date"
                  value={selectedClient.proximoPago}
                  onChange={(e) => {
                    setSelectedClient({ ...selectedClient, proximoPago: e.target.value });
                  }}
                />
              </div>
              <div className="form-row">
              </div>
              <button className="save-button" onClick={saveChanges}>
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && <ModalAddClient onClose={closeModal} />}
    </BaseLayout>
  );
}
