import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BaseLayout from "@/components/BaseLayout";

const PageReport = () => {
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
                <div >
                    <div className="Row-report">
                        <h1 className="service-report justify-center items-center">Reportes</h1>
                       {/*<div className="justify-center items-center">
                            <h2 className="content-select"> Mostrar</h2>
                            <select name="select-routine" className="form-select justify-center items-center">
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <input className="search-routine m-4" type="text" placeholder="Buscar" />
                        </div>
                        <div>
                            <h1 className=""></h1>
                            <button className="button-exercise" onClick={handlerExercise}>Agregar Ejercicio</button>
                        </div>

                        <div>
                            <h1 className="service-titles">Ej</h1>
                            <button className="button-exercise" onClick={handlerExercise}>Agreg</button>
    </div>*/}

                    </div>
                </div>
               {/* {isExerciseModalOpen && (
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
                )}*/}
            </section >
        </BaseLayout>

    )
}

export default PageReport;