import { useEffect, useState } from "react";
import BaseLayout from "@/pages/Sidebar/BaseLayout";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { TextField, InputAdornment, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getFirestore, collection, query, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/config";
import ModalAddClient from '@/components/ModalAddCliend';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';

import EditIcon from '@mui/icons-material/Edit';

import { ClassNames } from '@emotion/react';
import Link from 'next/link';


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

  const editClient = (client: TableData) => {
    // Crear un nuevo objeto con solo el nombre del cliente
    const editedClient = {
      ...client,
      name: client.name.split(' ')[0], // Tomar solo el primer nombre
    };
    setSelectedClient(editedClient);
    setShowModalEdit(true);
  };

  const viewClient = (client: TableData) => {
    // Crear un nuevo objeto con solo el nombre del cliente
    const viewClients = {
      ...client,
      name: client.id.split(' ')[0], // Tomar solo el primer nombre
    };
    setSelectedClient(viewClients);
  };

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
    });

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
      await deleteDoc(clientRef);

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
  const saveChanges = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

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

      // Actualiza el estado de la tabla
      setTableData((prevData) =>
        prevData.map((client) =>
          client.id === selectedClient.id ? selectedClient : client
        )
      );

      setShowModalEdit(false);
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
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
          <p className='text1'></p>
          <h1 className='text2H'>Habilitados</h1>
        </div>

        <div className="Deshabilitados">
          <img className="disabled" src="/img/disabled.png" />
          <p className='text1'></p>
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
                  <td>{client.estado}</td>
                  <td>

                    <EditIcon className="edit-icon"
                      onClick={() => editClient(client)} />


                    <EmailIcon className="email-icon" />
                  <Link key={client.id} href={`/ViewClient`}>
                    <VisibilityIcon className="email-icon" onClick={() => viewClient(client)}/>
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
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={saveChanges}>
              <label>Nombre:</label>
              <input
                type="text"
                placeholder="Nombre"
                value={selectedClient.name}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, name: e.target.value });
                }}
              />
              
              <label>Primer Apellido:</label>
              <input
                type="text"
                placeholder="Primer Apellido"
                value={selectedClient.lastName}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, lastName: e.target.value });
                }}
              />

              <label>Segundo Apellido:</label>
              <input
                type="text"
                placeholder="Segundo Apellido"
                value={selectedClient.secondLastName}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, secondLastName: e.target.value });
                }}
              />

              <label>Cedula:</label>
              <input
                type="text"
                placeholder="Cedula"
                value={selectedClient.cedula}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, cedula: e.target.value });
                }}
              />

              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                placeholder="Fecha de Nacimiento"
                value={selectedClient.birthDate}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, birthDate: e.target.value });
                }}
              />

              <label>Correo:</label>
              <input
                type="text"
                placeholder="Correo"
                value={selectedClient.mail}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, mail: e.target.value });
                }}
              />

              <label>Telefono:</label>
              <input
                type="text"
                placeholder="Telefono"
                value={selectedClient.phone}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, phone: e.target.value });
                }}
              />

              <label>Estado:</label>
              <select
                className="selectoptionE"
                value={selectedClient.estado}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, estado: e.target.value });
                }}
              >
                <option value="Habilitado">Habilitado</option>
                <option value="Deshabilitado">Deshabilitado</option>
              </select>

              <label>Sexo:</label>
              <select
                className="selectoptionE"
                value={selectedClient.gender}
                onChange={(e) => {
                  setSelectedClient({ ...selectedClient, gender: e.target.value });
                }}
              >
                <option>Femenino</option>
                <option>Masculino</option>
                <option>Otro</option>
              </select>

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
