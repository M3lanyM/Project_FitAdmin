import BaseLayout from "@/pages/Sidebar/BaseLayout";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { Search as SearchIcon } from '@mui/icons-material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface TableData {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface Props {
    data?: TableData[];
}

const initialData: TableData[] = [
    { id: 1, name: 'Estudiante', price: 20000, description: 'Ayuda para los que estudian' },
    { id: 2, name: 'Normal', price: 25000, description: 'Asistencia normal al gimnasio' },
    { id: 2, name: 'Personal', price: 35000, description: 'Clases especiales' },
];
export default function ClientMember({ data }: Props) {

    //modal
    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
    const handlerMembership = () => {
        setIsMembershipModalOpen(true);
    };
    const handleCloseMembershipModal = () => {
        setIsMembershipModalOpen(false);
    };
    const [showModal, setShowModal] = useState(false);


    const handleTextareaClear = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsMembershipModalOpen(false);
    };



    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const tableData = data || initialData;



    return (
        <BaseLayout>
            <div className="hClient">
                <div className="ContaMember">
                    <h1 className="title-member">Membresias</h1>
                    <button onClick={handlerMembership} className="btnMember">
                        + Agregar Membresias</button>

                    <div className='hClient'>
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
                                marginRight: '300px',
                            }}
                        />
                        <div className="member-row">
                            <label className="title-memberTipe" >Tipo de membresia </label>
                            <select name="select-Member" className="memberTipe">
                                <option value="">Estudiante</option>
                                <option value="">Normal</option>
                                <option value="">Personal</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tableMember-container">
                <table className="tableMember">
                    <thead>
                        <tr className="fixed-header-row">
                            <th className="th-tableMember">Nombre</th>
                            <th className="th-tableMember">Categoria</th>
                            <th className="th-tableMember">Descripción</th>
                            <th className="th-tableMember">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row: TableData) => (
                                <tr key={row.id} className="tableMember-row">
                                    <td>{row.name}</td>
                                    <td>{row.price}</td>
                                    <td>{row.description}</td>
                                    <td>
                                        <EditIcon className="edit-icon"></EditIcon>
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
            {isMembershipModalOpen && (
                <div className="modal-addMember">
                    <div className="content-addRoutine">
                        <span className="close-addRoutine " onClick={handleCloseMembershipModal}>&times;</span>
                        <div className="">
                            <div>
                                <div>
                                    <h2 className="service-titles">Agregar Membresia </h2>
                                </div>
                                <div className="line-addRoutine"></div>
                                <div className="">
                                    <h2 className="text-addRoutiner">Tipo de Membresia</h2>
                                    <input type="text" className="info-addRoutine" placeholder="Tipo" />
                                </div>
                            </div>
                            <div className="">
                                <h2 className="text-addRoutine">Descripcion</h2>
                                <textarea name="descrption" placeholder="Descripcion" className="description-addRoutine"></textarea>
                            </div>
                            <div className="line-addRoutine"></div>
                            <div className="">
                                <h2 className="text-addRoutiner">Precio</h2>
                                <input type="text" className="info-addRoutine" placeholder="$" />
                            </div>
                            <div className="line-addRoutine"></div>
                            <div className="button-addRoutine2 flexs center" >
                                <button className="colors" onClick={handleTextareaClear}>Agregar </button>
                                <button className="exit-addRoutine" onClick={handleCloseMembershipModal}>Cancelar</button>
                            </div>
                            {showModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <p>Se agrego nueva Membresia</p>
                                        <button className="button-addRoutine colors" onClick={closeModal}>Listo</button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </BaseLayout>
    );
}
