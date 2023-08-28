import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BaseLayout from "@/components/BaseLayout";
import TableRoutine from '@/components/TableRoutine';
import { TextField, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import { Search as SearchIcon } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';


const PageRoutine = () => {
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
    const handlerRoutine = () => {
        setIsRoutineModalOpen(true);
    };

    const handleCloseRoutineModal = () => {
        setIsRoutineModalOpen(false);
    };

    const options: string[] = ['Plancha', 'Peso Muerto', 'Aperturas con TRX'];

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [textareaValue, setTextareaValue] = useState<string>('');
    const [showModal, setShowModal] = useState(false);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        setSelectedOptions([...selectedOptions, selectedOption]);
        setTextareaValue(textareaValue + selectedOption + '\n');
    };

    const handleOptionRemove = (option: string) => {
        const updatedSelectedOptions = selectedOptions.filter(item => item !== option);
        setSelectedOptions(updatedSelectedOptions);
        setTextareaValue(updatedSelectedOptions.join('\n') + '\n');
    };

    const handleTextareaClear = () => {
        setSelectedOptions([]);
        setTextareaValue('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsRoutineModalOpen(false);
    };

    return (
        <BaseLayout>
            <section className="container-routine">
                <div className="Row">
                    <div>
                        <h1 className="service-titles">Rutinas</h1>
                        <button className="button-routine" onClick={handlerRoutine}> + Crear Rutinas</button>
                    </div>
                    <div className="line-routine"></div>
                    <div className=" flex mb-5">
                        <h2 className="content-select"> Buscar</h2>
                        <TextField
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon className="SearchIcon" />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Buscar rutina"
                            sx={{
                                left:'61%',
                                top: '25%',
                                width: '25%',
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#2b8c8c',
                                },
                            }}
                        />
                    </div>
                    <section>
                    <TableRoutine />
                    </section>
                </div>
                {isRoutineModalOpen && (
                    <div className="modal-addRoutine">
                        <div className="content-addRoutine">
                            <span className="close-addRoutine " onClick={handleCloseRoutineModal}>&times;</span>
                            <div className="">
                                <div>
                                    <div>
                                        <h2 className="service-titles">Crear Rutinas</h2>
                                    </div>
                                    <div className="line-addRoutine"></div>
                                    <div className="">
                                        <h2 className="text-addRoutiner">Nombre De La Rutina</h2>
                                        <input type="text" className="info-addRoutine" placeholder="Nombre" />
                                    </div>
                                </div>
                                <div className="">
                                    <h2 className="text-addRoutine">Descripcion</h2>
                                    <textarea name="descrption" placeholder="Descripcion" className="description-addRoutine"></textarea>
                                </div>
                                <div className="line-addRoutine"></div>
                                <div className="justify-center items-center">
                                    <h2 className="space-addRoutine">Categoria</h2>
                                    <select name="select-addroutine" className="space-addRoutine justify-center items-center">
                                        <option value="">Lista de Categorias</option>
                                        <option value="">Gluteos</option>
                                        <option value="">Piernas</option>
                                    </select>
                                </div>
                                <div className="line-addRoutine"></div>
                                <div>
                                    <select className="space-addRoutine" onChange={handleSelectChange}>
                                        <option value="">Lista de Ejercicios:</option>
                                        {options.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <textarea className="description-addRoutine space-addRoutine" value={textareaValue} rows={5} readOnly />
                                    <div className="text-addRoutine space-addRoutine">
                                        Ejercicios seleccionados:
                                        <ul className="space-addRoutine" >
                                            {selectedOptions.map((option, index) => (
                                                <li key={index}>
                                                    {option}
                                                    <button className="button-addRoutine" onClick={() => handleOptionRemove(option)}>Eliminar</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="button-addRoutine2" >
                                    <button className="colors" onClick={handleTextareaClear}>Crear Rutina</button>
                                    <button className="exit-addRoutine" onClick={handleCloseRoutineModal}>Cancelar</button>
                                </div>
                                {showModal && (
                                    <div className="modal">
                                        <div className="modal-content">
                                            <p>Se guardo la nueva rutina</p>
                                            <button className="button-addRoutine colors" onClick={closeModal}>Listo</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </section >
        </BaseLayout>

    )
}

export default PageRoutine;