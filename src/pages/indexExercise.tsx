import BaseLayout from "@/pages/Sidebar/BaseLayout";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from '@mui/icons-material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


interface TableData {
    id: number;
    name: string;
    type: string;
    description: string;
}

interface Props {
    data?: TableData[];
}

const initialData: TableData[] = [
    { id: 1, name: 'Comienzo', type: 'Gluteos', description: 'Gluteos para principiantes' },
    { id: 2, name: 'Medio', type: 'Piernas', description: 'Piernas para fortalecer' },
];

export default function ExercisePage({ data }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const tableData = data || initialData;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
    const handlerExercise = () => {
        setIsExerciseModalOpen(true);
    };

    const handleCloseRoutineModal = () => {
        setIsExerciseModalOpen(false);
    };

    const options: string[] = ['Plancha', 'Peso Muerto', 'Aperturas con TRX'];

    const handleTextareaClear = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsExerciseModalOpen(false);
    };

    return (
        <BaseLayout>
            <div className='hBill'>
                <div className='ContaRoutine'>
                    <div className='searchBill1'>
                        <label className="custom-labelExercise">Ejercicios</label>
                        <button className="btnExercise" onClick={handlerExercise}>+ Agregar Ejercicio</button>
                    </div>    <div className='searchBill'>
                        <TextField
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon className="SearchIcon" />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Buscar ejercicio"
                            sx={{
                                width: '120%', height: '1%',
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#A1A626',
                                },
                                bottom: '-39%', right: '114%',
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="tableRoutine-container">
                <table className="tableRoutine">
                    <thead>
                        <tr className="fixed-header-row">
                            <th className="th-tableRoutine">Nombre</th>
                            <th className="th-tableRoutine">Precio</th>
                            <th className="th-tableRoutine">Descripción</th>
                            <th className="th-tableRoutine">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <tr key={row.id} className="tableRoutine-row">
                                    <td>{row.name}</td>
                                    <td>{row.type}</td>
                                    <td>{row.description}</td>
                                    <td>
                                        <EditIcon className="edit-icon" />
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
            {isExerciseModalOpen && (
                <div className="modal-addRoutine">
                    <div className="content-addRoutine">
                        <span className="close-addRoutine " onClick={handleCloseRoutineModal}>&times;</span>
                        <div className="">
                            <div>
                                <div>
                                    <h2 className="service-titles">Agregar Ejercicio </h2>
                                </div>
                                <div className="line-addRoutine"></div>
                                <div className="">
                                    <h2 className="text-addRoutiner">Nombre Del Ejercicio</h2>
                                    <input type="text" className="info-addRoutine" placeholder="Nombre" />
                                </div>
                            </div>
                            <div className="">
                                <h2 className="text-addRoutine">Descripcion</h2>
                                <textarea name="descrption" placeholder="Descripcion" className="description-addRoutine"></textarea>
                            </div>
                            <div className="line-addRoutine"></div>
                            <div className="center">
                                <h2 className="space-addRoutine">Categoria</h2>
                                <select name="select-addroutine" className="space-addRoutine center">
                                    <option value="">Lista de Categorias</option>
                                    <option value="">Gluteos</option>
                                    <option value="">Piernas</option>
                                </select>
                            </div>
                            <div className="line-addRoutine"></div>
                            <div className="button-addRoutine2 flexs center" >
                                <button className="colors" onClick={handleTextareaClear}>Agregar </button>
                                <button className="exit-addRoutine" onClick={handleCloseRoutineModal}>Cancelar</button>
                            </div>
                            {showModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <p>Se agrego el nuevo ejercicio</p>
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
