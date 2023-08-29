import React, { useState } from 'react';
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


export interface TableData {
  id: number;
  name: string;
  mail: string;
  state: string;
}

interface Props {
  data?: TableData[];
}

export const initialData: TableData[] = [
  { id: 1, name: 'John Doe', mail: 'j@mail', state: 'Activo' },
  { id: 2, name: 'Doe', mail: 'D@mail', state: 'Activo' },
  { id: 3, name: 'Jail', mail: 'j@mail', state: 'Desactivado' },
  { id: 4, name: 'Arnol', mail: 'A@mail', state: 'Activo' },
  { id: 4, name: 'Arnol', mail: 'A@mail', state: 'Activo' },
  { id: 3, name: 'Jail', mail: 'j@mail', state: 'Desactivado' },
  { id: 4, name: 'Arnol', mail: 'A@mail', state: 'Activo' },
];

const TableClient: React.FC<Props> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableData = data || initialData;

  return (
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
              <TableCell className="tableClient-cell" sx={{ textAlign: 'center' ,padding: '5px 16px',}}>
                {row.name}
              </TableCell>
              <TableCell className="tableClient-cell" sx={{ textAlign: 'center' ,padding: '5px 16px', }}>
                {row.mail}
              </TableCell>
              <TableCell className="tableClient-cell" sx={{textAlign: 'center' ,padding: '5px 16px',}}>
                {row.state}
              </TableCell>
              <TableCell className="tableClient-cell" sx={{textAlign: 'center' ,padding: '5px 16px',}}>
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
              color: '#A1A626',   // Set button color
            },
          }}
          backIconButtonProps={{
            className: 'pagination-button',
            sx: {
              color: '#A1A626',   // Set button color
            },
          }}
          sx={{
            '.MuiTablePagination-select': {
              border: '2px solid #A1A626',  // Set border style
              borderRadius: '10px',         // Set border radius
            },
          }}
        />
      </div>
    </TableContainer>
  );
};

export default TableClient;
