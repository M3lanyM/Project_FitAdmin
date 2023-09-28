import React, { useState, useEffect } from 'react';
import BaseLayout from "@/pages/Sidebar/BaseLayout";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
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

export interface TableData {
  id: string;
  name: string;
  mail: string;
  state: string;
}

export default function ClientPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<TableData[]>([]); // Usar estado para almacenar los datos de Firebase.
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const activeClientsCount = calculateActiveClientsCount();
  const deactiveClientsCount = calculateDeactivateClientsCount();

  function calculateActiveClientsCount() {
    const activeClients = tableData.filter(client => client.state === 'Habilitado');
    return activeClients.length;
  }

  function calculateDeactivateClientsCount() {
    const deactivateClients = tableData.filter(client => client.state === 'Deshabilitado');
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

      <TableContainer component={Paper} className="tableClient-container">
        <Table className="tableClient">
          <TableHead>
            <TableRow className="tableClient-header-row">
              <TableCell
                className="tableClient-header-cell"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Cliente
              </TableCell>
              <TableCell
                className="tableClient-header-cell"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Correo
              </TableCell>
              <TableCell
                className="tableClient-header-cell"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Estado
              </TableCell>
              <TableCell
                className="tableClient-header-cell"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Acción
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} className="tableClient-row">
                <TableCell className="tableClient-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
                  {row.name}
                </TableCell>
                <TableCell className="tableClient-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
                  {row.mail}
                </TableCell>
                <TableCell className="tableClient-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
                  {row.state}
                </TableCell>
                <TableCell className="tableClient-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
                  <IconButton>
                    <EmailIcon className="email-icon" />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon className="delete-icon" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="pagination-container">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Mostrar"
            nextIconButtonProps={{
              className: 'pagination-button',
              sx: {
                color: '#A1A626',
              },
            }}
            backIconButtonProps={{
              className: 'pagination-button',
              sx: {
                color: '#A1A626',
              },
            }}
            sx={{
              '.MuiTablePagination-select': {
                border: '2px solid #A1A626',
                borderRadius: '10px',
              },
            }}
          />
        </div>
      </TableContainer>
      
      {isModalOpen && <ModalAddClient onClose={closeModal} />}
    </BaseLayout>
  );
}
