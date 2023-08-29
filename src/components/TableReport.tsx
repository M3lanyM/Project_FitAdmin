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
import EmailIcon from '@mui/icons-material/Edit';

export interface TableData {
    id: number;
    name: string;
    member: string;
    state: string;
}

interface Props {
    data?: TableData[];
}

export const initialData: TableData[] = [
    { id: 1, name: 'John Doe', member: 'Estudiante', state: 'Activo' },
  { id: 2, name: 'Doe', member: 'Normal', state: 'Activo' },
  { id: 3, name: 'Arnol', member: 'Normal', state: 'Activo' },
  { id: 4, name: 'Arnol', member: 'Normal', state: 'Activo' },
  { id: 5, name: 'Jail', member: 'Personal', state: 'Desactivado' },
];

const TableWithPagination: React.FC<Props> = ({ data }) => {
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
        <TableContainer component={Paper} className=" container-table-report ">

            <Table className="report-table ">
                <TableHead>
                    <TableRow className="routine-th">
                        <TableCell className="tableClient-header-cell">Nombre</TableCell>
                        <TableCell className="tableClient-header-cell">Categoria</TableCell>
                        <TableCell className="tableClient-header-cell">Descripcion</TableCell>
                        <TableCell className="tableClient-header-cell">Accion</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.id} className="routine-td">
                            <TableCell className="tableClient-cell">{row.name}</TableCell>
                            <TableCell className="tableClient-cell">{row.member}</TableCell>
                            <TableCell className="tableClient-cell">{row.state}</TableCell>
                            <TableCell >
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Mostrar"
                nextIconButtonProps={{
                    className: 'pagination-button'
                }}
                backIconButtonProps={{
                    className: 'pagination-button'
                }}
            />
        </TableContainer>
    );
};

export default TableWithPagination;
