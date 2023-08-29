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
    cliente: string;
    total: number;
    fecha: string;
    estado: string;
}

interface Props {
    data?: TableData[];
}

export const initialData: TableData[] = [
    { id: 1, cliente: 'John Doe', total: 100, fecha: '2023-08-29', estado: 'Activo' },
    // ... other data
];

const TableBill: React.FC<Props> = ({ data }) => {
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
        <TableContainer component={Paper} className="tableBill-container">
            <Table className="tableBill">
                <TableHead>
                    <TableRow className="tableBill-header-row">
                        <TableCell
                            className="tableBill-header-cell"
                            sx={{
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            Cliente
                        </TableCell>
                        <TableCell
                            className="tableBill-header-cell"
                            sx={{
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            Total
                        </TableCell>
                        <TableCell
                            className="tableBill-header-cell"
                            sx={{
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            Fecha
                        </TableCell>
                        <TableCell
                            className="tableBill-header-cell"
                            sx={{
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            Estado
                        </TableCell>
                        <TableCell
                            className="tableBill-header-cell"
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
                        <TableRow key={row.id} className="tableBill-row">
                            <TableCell className="tableBill-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
                                {row.cliente}
                            </TableCell>
                            <TableCell className="tableBill-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
                                {row.total}
                            </TableCell>
                            <TableCell className="tableBill-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
                                {row.fecha}
                            </TableCell>
                            <TableCell className="tableBill-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
                                {row.estado}
                            </TableCell>
                            <TableCell className="tableBill-cell" sx={{ textAlign: 'center', padding: '5px 16px', }}>
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
    );
};

export default TableBill;
