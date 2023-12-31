import { Autocomplete, Button, IconButton, InputAdornment, List, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from '@mui/icons-material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getFirestore, collection, query, onSnapshot, deleteDoc, doc, updateDoc, where, getDocs, addDoc, DocumentData, DocumentReference, getDoc } from 'firebase/firestore';
import firebaseConfig from "@/firebase/config";
import { initializeApp } from "firebase/app";
import AdminLayout from "./AdminLayout/AdminLayout";


interface TableData {
    id: string;
    name: string;
    description: string;
    series: string;
    repetitions: string;
    exercise?: string; //ref ejercicios
    exercises?: string
}


export default function RoutinePage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [searchQuery, setSearchQuery] = useState("");
    const [exerciseOptions, setExerciseOptions] = useState<string[]>(["Seleccione una opción"]);
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [routineToDelete, setRoutineToDelete] = useState<TableData | null>(null);
    const [selectedRoutineExercises, setSelectedRoutineExercises] = useState<string[]>([]);
    const [selectedRoutineId, setSelectedRoutineId] = useState<string>(""); // Nuevo estado para guardar el ID de la rutina seleccionada
    const [editingRoutineData, setEditingRoutineData] = useState<TableData | null>(null);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        series: "",
        repetitions: "",
        exercise: "",

    });

    useEffect(() => {
        const routineCollection = collection(db, 'rutina');
        const q = query(routineCollection);

        // Crea un oyente en tiempo real para la colección de clientes
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                const { nombre, descripcion, serie, repeticion, ejercicios } = doc.data();
                return {
                    id: doc.id,
                    name: nombre,
                    description: descripcion,
                    series: serie,
                    repetitions: repeticion,
                    exercise: ejercicios
                };
            });
            const filteredData = data.filter((routine) =>
                routine.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setTableData(filteredData);

        });

        //trae los datos del ejercicio al combox 
        const fetchExerciseTypes = async () => {
            const exerciseCollection = collection(db, "ejercicio");
            const exerciseQuery = query(exerciseCollection);
            const exerciseSnapshot = await getDocs(exerciseQuery);

            const exerciseTypes: { [key: string]: number } = {};
            exerciseSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.nombre && data.categoria) {
                    exerciseTypes[data.nombre] = data.categoria;
                }
            });

            setExerciseOptions(Object.keys(exerciseTypes));
        };


        fetchExerciseTypes();
        setFormData((prevData) => ({
            ...prevData,
            exercise: "Seleccione una opción",
        }));

        // Limpiar el oyente cuando el componente se desmonta   
        return () => {
            unsubscribe();
        };
    }, [app, searchQuery]);

    // Función para obtener las referencias a los documentos de ejercicios por nombres
    const getExerciseRefsByNames = async (exerciseNames: string[]) => {
        const exerciseRefs: DocumentReference<DocumentData, DocumentData>[] = [];
        for (const name of exerciseNames) {
            const exerciseCollection = collection(db, "ejercicio");
            const exerciseQuery = query(exerciseCollection, where("nombre", "==", name));
            const exerciseSnapshot = await getDocs(exerciseQuery);

            if (!exerciseSnapshot.empty) {
                exerciseSnapshot.forEach((doc) => {
                    exerciseRefs.push(doc.ref); // Crea una referencia al documento
                });
            }
        }
        return exerciseRefs;
    };

    const handleAddRoutine = async () => {
        try {
            const exerciseRefs = await getExerciseRefsByNames(selectedExerciseIds);

            // Agrega los datos del formulario a la colección "rutina" en Firestore
            const docRef = await addDoc(collection(db, "rutina"), {
                nombre: formData.name,
                descripcion: formData.description,
                serie: formData.series,
                repeticion: formData.repetitions,
                ejercicios: exerciseRefs, // Utiliza referencias a los documentos de ejercicios
            });

            console.log("Documento escrito con ID: ", docRef.id);

            // Limpia el formulario después de la presentación exitosa
            setFormData({
                name: "",
                description: "",
                series: "",
                repetitions: "",
                exercise: "",
            });

            handleCloseRoutineModal();

        } catch (error) {
            console.error("Error al agregar el documento: ", error);
        }
    };

    const handlerRoutine = () => {
        setIsRoutineModalOpen(true);
    };

    // Limpiar los campos al cerrar el modal
    const handleCloseRoutineModal = () => {
        setFormData({
            name: "",
            description: "",
            series: "",
            repetitions: "",
            exercise: "",
        });
        setIsRoutineModalOpen(false);
        clearSelectedExercises(); // Limpiar ejercicios seleccionados al cerrar el modal
    };

    const closeModal = () => {
        handleAddRoutine();
        setFormData({
            name: "",
            description: "",
            series: "",
            repetitions: "",
            exercise: "",
        });
        setShowModal(false);
        setIsRoutineModalOpen(false);
        clearSelectedExercises(); // Limpiar ejercicios seleccionados al cerrar el modal
    };
    //Limpiar la lista
    const clearSelectedExercises = () => {
        setSelectedExerciseIds([]);
    };

    const handleCancelClear = () => {
        setFormData({
            name: "",
            description: "",
            series: "",
            repetitions: "",
            exercise: "",
        });
        setSelectedOptions([]);
        setIsRoutineModalOpen(false);
        clearSelectedExercises(); // Limpiar ejercicios seleccionados al cancelar

    };

    //cambio
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        if (selectedOption) {
            setSelectedExerciseIds((prevIds) => [...prevIds, selectedOption]);
        }
    };

    const handleOptionRemove = (id: string) => {
        const updatedSelectedExerciseIds = selectedExerciseIds.filter((exerciseId) => exerciseId !== id);
        setSelectedExerciseIds(updatedSelectedExerciseIds);
    };

    const handleTextareaClear = () => {
        setSelectedOptions([]);
        setShowModal(true);
    };


    const handleDeleteRoutine = async (routineId: string) => {
        try {
            await deleteDoc(doc(db, 'rutina', routineId));
        } catch (error) {
            console.error("Error al eliminar la rutina: ", error);
        }
    }

    // Función para abrir el modal de confirmación de eliminación
    const openDeleteConfirmation = (routine: TableData) => {
        setIsDeleteConfirmationOpen(true);
        setRoutineToDelete(routine);
    }

    // Función para cerrar el modal de confirmación
    const closeDeleteConfirmation = () => {
        setIsDeleteConfirmationOpen(false);
        setRoutineToDelete(null);
    }

    // Función para confirmar la eliminación de la rutina
    const confirmDeleteRoutine = async () => {
        // Llama a la función para eliminar la rutina
        if (routineToDelete) {
            await handleDeleteRoutine(routineToDelete.id);
        }
        closeDeleteConfirmation();
    }

    const getExerciseNamesByIds = async (exerciseRefs: DocumentReference[]) => {
        const exerciseNames = [];

        for (const exerciseRef of exerciseRefs) {
            const exerciseDocSnapshot = await getDoc(exerciseRef);

            if (exerciseDocSnapshot.exists()) {
                const exerciseData = exerciseDocSnapshot.data();
                exerciseNames.push(exerciseData.nombre);
            }
        }

        return exerciseNames;
    };

    const handleEditRoutine = async (routineId: string) => {
        setSelectedRoutineId(routineId);
        const routineDocRef = doc(collection(db, 'rutina'), routineId);
        const routineDocSnapshot = await getDoc(routineDocRef);

        if (routineDocSnapshot.exists()) {
            const routineData = routineDocSnapshot.data();
            setEditingRoutineData({
                id: routineId,
                name: routineData.nombre,
                description: routineData.descripcion,
                series: routineData.serie,
                repetitions: routineData.repeticion,
            });
            const exerciseRefs = routineData.ejercicios;
            const exerciseNames = await getExerciseNamesByIds(exerciseRefs);
            setSelectedRoutineExercises(exerciseNames);

            setIsModalOpen(true); // Abre el modal para edición
        } else {
            console.log('La rutina no existe');
        }
    };

    const handleExerciseRemove = async (exerciseName: string) => {
        const updatedExercises = selectedRoutineExercises.filter(exercise => exercise !== exerciseName);
        setSelectedRoutineExercises(updatedExercises); // Actualiza la lista en el estado local

        // Lógica para actualizar la lista de ejercicios en la base de datos
        if (selectedRoutineId) {
            const editedRoutineRef = doc(db, 'rutina', selectedRoutineId);
            const remainingExerciseRefs = await getExerciseRefsByNames(updatedExercises);

            // Actualiza la colección 'rutina' con las referencias actualizadas
            await updateDoc(editedRoutineRef, { ejercicios: remainingExerciseRefs })
                .then(() => {
                    console.log('Ejercicio eliminado con éxito de la rutina en la base de datos');
                })
                .catch(error => {
                    console.error('Error al actualizar la base de datos: ', error);
                });
        }
    };

    const handleUpdateRoutine = async () => {
        if (editingRoutineData) {
            try {
                const { id, name, description, series, repetitions } = editingRoutineData;

                const routineRef = doc(db, "rutina", id);
                const exerciseRefs = await getExerciseRefsByNames(selectedRoutineExercises);

                await updateDoc(routineRef, {
                    nombre: name,
                    descripcion: description,
                    serie: series,
                    repeticion: repetitions,
                    ejercicios: exerciseRefs, // Utiliza referencias a los documentos de ejercicios
                });

                setIsModalOpen(false); // Cierra el modal después de la actualización exitosa
            } catch (error) {
                console.error("Error al actualizar la rutina: ", error);
            }
        }
    };


    const handleAddExerciseToList = () => {
        if (formData.exercise && formData.exercise !== "Seleccione una opción") {
            setSelectedRoutineExercises((prevExercises) => [
                ...prevExercises,
                formData.exercise,
            ]);

            setFormData({ ...formData, exercise: "Seleccione una opción" });
        }
    };

    const cancelEdit = () => {
        setIsModalOpen(false);
    };


    return (
        <AdminLayout>
            <div className='hBill'>
                <div className='ContaRoutine'>
                    <label className="custom-labelRoutine">Rutinas</label>
                    <div className='searchBill'>
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
                                width: '80%', height: '1%',
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#A1A626',
                                },
                                bottom: '-24%', right: '53%',
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btnRoutine" onClick={handlerRoutine} > + Crear Rutinas</button>

                    </div>
                </div>
            </div>
            <div className="tableRoutine-container">
                <table className="tableRoutine">
                    <thead>
                        <tr className="fixed-header-row">
                            <th className="th-tableRoutine">Nombre</th>
                            <th className="th-tableRoutine">Descripción</th>
                            <th className="th-tableRoutine">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((routine, index) => (
                                <tr key={index} className="tableMember-row">
                                    <td>{routine.name}</td>
                                    <td>{routine.description}</td>
                                    <td>
                                        <EditIcon className="edit-icon"
                                            onClick={() => handleEditRoutine(routine.id)} />
                                        <DeleteIcon className="delete-icon"
                                            onClick={() => openDeleteConfirmation(routine)}
                                        />

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
            {isRoutineModalOpen && (
                <div className="modal-addRoutine">
                    <div className="content-addRoutine">
                        <span className="close-addRoutine " onClick={handleCancelClear}>&times;</span>
                        <div>
                            <h2 className="personalExerc-title">Crear Rutinas</h2>
                        </div>
                        <div className="line-addRoutine"></div>
                        <div className="form-row">
                            <h2 className="Exercise-title">Nombre De La Rutina</h2>
                            <input
                                type="text"
                                className="personalRoutine"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <h2 className="Exercise-title">Descripcion</h2>
                            <textarea
                                name="descrption"
                                placeholder="Descripcion"
                                className="descripcion-data"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>
                        <div className="input-groupRout">
                            <div className="form-row">
                                <h2 className="Exercise-title">Series del Ejercicio</h2>
                                <input
                                    type="number"
                                    className="personalRoutine1"
                                    placeholder="Series"
                                    value={formData.series}
                                    onChange={(e) => setFormData({ ...formData, series: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <h2 className="Exercise-title">Repeticiones del Ejercicio</h2>
                                <input
                                    type="number"
                                    className="personalRoutine1"
                                    placeholder="Repeticiones"
                                    value={formData.repetitions}
                                    onChange={(e) => setFormData({ ...formData, repetitions: e.target.value })} />
                            </div>
                        </div>
                        <select
                            className="selectRoutine"
                            name="exercise"
                            value={formData.exercise}
                            onChange={handleSelectChange}
                        >
                            <option value="">Lista de Ejercicios:</option>
                            {exerciseOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="form-row">
                            <h2 className="title-selectExercise">Ejercicios seleccionados:</h2>
                            <div className="exercise-list">
                                <ul>
                                    {selectedExerciseIds.map((exerciseId, index) => {
                                        const exercise = exerciseOptions.find((option) => option === exerciseId);
                                        return (
                                            <li key={index}>
                                                <IconButton onClick={() => handleOptionRemove(exerciseId)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                {exercise}
                                            </li>

                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        <button className="saveRutin-button" onClick={handleTextareaClear}>Crear Rutina</button>
                        <button className="cancelRutin-button" onClick={handleCancelClear}>Cancelar</button>
                        {showModal && (
                            <div className="modal-ready">
                                <div className="custom-modal-ready">
                                    <p className='text-ready'>Se agrego una nueva rutina</p>
                                    <button className="confirmReady" onClick={closeModal}>Listo</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isDeleteConfirmationOpen && (
                <div className="modal-delete">
                    <div className="custom-modal-delete">
                        <p className='text-delete'>¿Estás seguro de que deseas eliminar esta rutina?</p>
                        <button className="confirmDelete" onClick={confirmDeleteRoutine}>Si</button>
                        <button className="cancelDelete" onClick={closeDeleteConfirmation}>No</button>
                    </div>
                </div>
            )}
            {isModalOpen && editingRoutineData && (
                <div className="modalEdit">
                    <div className="modalEdit-content">
                        <h2 className="personalInfo-title">Editar Rutina</h2>
                        <div className="input-group ">
                            <TextField
                                label="Nombre"
                                value={editingRoutineData.name}
                                onChange={(e) => setEditingRoutineData({ ...editingRoutineData, name: e.target.value })}
                            />
                            <TextField
                                label="Descripción"
                                value={editingRoutineData.description}
                                onChange={(e) => setEditingRoutineData({ ...editingRoutineData, description: e.target.value })}
                            />

                        </div>
                        <div className="input-group ">
                            <TextField
                                label="Series"
                                value={editingRoutineData.series}
                                onChange={(e) => setEditingRoutineData({ ...editingRoutineData, series: e.target.value })}
                            />
                            <TextField
                                label="Repeticiones"
                                value={editingRoutineData.repetitions}
                                onChange={(e) => setEditingRoutineData({ ...editingRoutineData, repetitions: e.target.value })}
                            />
                        </div>
                        <div className="input-group2 ">
                            <Autocomplete
                                className="Autocomplete-Exerc"
                                value={formData.exercise}
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        setFormData({ ...formData, exercise: newValue });
                                    }
                                }}
                                options={exerciseOptions}
                                renderInput={(params) => <TextField {...params} label="Lista de Ejercicios" />}
                            />
                            <button className="add-buttonRutine" onClick={handleAddExerciseToList}>Agregar Ejercicio</button>
                        </div>

                        <h2 className="Rutine-title">Ejercicios asociados:</h2>
                        <div className="exercise-list-container">
                            <ul className="ul-Routine">
                                {selectedRoutineExercises.map((exercise, index) => (
                                    <li className="li-Routine" key={index}>
                                        {exercise}
                                        <IconButton onClick={() => handleExerciseRemove(exercise)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </li>
                                ))}
                            </ul></div>
                        <button className="saveRutin-button" onClick={handleUpdateRoutine}>Guardar Cambios</button>
                        <button className="cancelRutin-button" onClick={cancelEdit}>Cancelar</button>
                    </div>
                </div>
            )}



        </AdminLayout>
    );
}