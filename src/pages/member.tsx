import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BaseLayout from "@/components/BaseLayout";

const PageMember = () => {
    const [isExerciseModalOpen , setIsExerciseModalOpen] = useState(false);
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
                        <h1 className="service-titles">Membresias</h1>
                        <button className="button-exercise" onClick={handlerExercise}>Agregar Membresias</button>
                    </div>
                    <div className="line-routine"></div>
                    <div className="flex">
                        <div className="search-exercise" >
                            <h2 > Buscar</h2>
                            <input type="text" placeholder="Buscar" />
                        </div>

                        <div className="exercise-type">
                            <h2 > Tipo </h2>
                            <select name="select-addroutine" className="space-addRoutine justify-center items-center">
                                <option value="">Estudiantes</option>
                                <option value="">Normal</option>
                                <option value="">Personal</option>
                            </select>
                        </div>
                    </div>
                    <section>
                        <div className="container-table">
                            <table className="routine-table">
                                <thead className="routine-th">
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Precio por mes</th>
                                        <th>Descripcion</th>
                                    </tr>
                                </thead>
                                <tbody className="routine-td">
                                    <tr>
                                        <td>Normal</td>
                                        <td>25.000</td>
                                        <td>Normal</td>
                                    </tr>
                                    <tr>
                                        <td>Estudiante</td>
                                        <td>15.000</td>
                                        <td>Pertenece alguna institucion educativa</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <div className="">
                        <button className="table-button" onClick={handlerExercise}>Editar</button>
                        <button className="table-button">Eliminar</button>
                    </div>
                </div>
                {isExerciseModalOpen && (
                    <div className="modal-addRoutine">
                        <div className="content-addRoutine">
                            <span className="close-addRoutine " onClick={handleCloseRoutineModal}>&times;</span>
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
                                <div className="button-addRoutine2 flex justify-center items-center" >
                                    <button className="colors" onClick={handleTextareaClear}>Agregar </button>
                                    <button className="exit-addRoutine" onClick={handleCloseRoutineModal}>Cancelar</button>
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
            </section >
        </BaseLayout>

    )
}

export default PageMember;