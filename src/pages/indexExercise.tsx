import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BaseLayout from "@/components/BaseLayout";
import TableExercise from '@/components/TableExercise';
import { TextField, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import { Search as SearchIcon } from '@mui/icons-material';

const PageExercise = () => {
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
    const handlerExercise = () => {
        setIsExerciseModalOpen(true);
    };

    const handleCloseRoutineModal = () => {
        setIsExerciseModalOpen(false);
    };

    const options: string[] = ['Plancha', 'Peso Muerto', 'Aperturas con TRX'];

    const [showModal, setShowModal] = useState(false);


    const handleTextareaClear = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsExerciseModalOpen(false);
    };

    return (
        <BaseLayout>
            <section className="container-routine">
                <div className="Row">
                    <div>
                        <h1 className="service-titles">Ejercicios</h1>
                        <button className="button-exercise" onClick={handlerExercise}>Agregar Ejercicio</button>
                    </div>
                    <div className="line-routine"></div>
                    <div className="flex mb-5">
                        <div className="search-exercise" >
                            <h2 > Buscar</h2>
                            <input type="text" placeholder="Buscar" />
                        </div>
                        <div className="exercise-type">
                            <h2 > Categoria </h2>
                            <select name="select-addroutine" className="space-addRoutine justify-center items-center">
                                <option value="">Lista de Categorias</option>
                                <option value="">Gluteos</option>
                                <option value="">Piernas</option>
                            </select>
                        </div>
                    </div>
                    <section>
                        <TableExercise/>
                    </section>
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
                                <div className="justify-center items-center">
                                    <h2 className="space-addRoutine">Categoria</h2>
                                    <select name="select-addroutine" className="space-addRoutine justify-center items-center">
                                        <option value="">Lista de Categorias</option>
                                        <option value="">Gluteos</option>
                                        <option value="">Piernas</option>
                                    </select>
                                </div>
                                <div className="line-addRoutine"></div>
                                <div className="button-addRoutine2 flex justify-center items-center" >
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
            </section >
        </BaseLayout>

    )
}

export default PageExercise;