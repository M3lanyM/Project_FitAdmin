import BaseLayout from "@/pages/Sidebar/BaseLayout";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from '@mui/icons-material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getFirestore, collection, query, onSnapshot, deleteDoc, doc, updateDoc, where, getDocs, addDoc, DocumentData, DocumentReference } from 'firebase/firestore';
import firebaseConfig from "@/firebase/config";
import { initializeApp } from "firebase/app";


interface TableData {
    id: string;
    name: string;
    description: string;
    serie: number;
    repetitions: number;
    exercise?: string;
}


export default function RoutinePage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [routineIdToDelete, setRoutineIdToDelete] = useState('');
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedRoutine, setSelectedRoutine] = useState<TableData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [exerciseOptions, setExerciseOptions] = useState<string[]>(["Seleccione una opción"]);
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);


    const [formData, setFormData] = useState({
        name: "",
        description: "",
        serie: "",
        repetitions: "",
        exercise: "",

    });

    useEffect(() => {
        const routineCollection = collection(db, 'rutina');
        const q = query(routineCollection);

        // Crea un oyente en tiempo real para la colección de clientes
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                const { nombre, descripcion, series, repeticiones } = doc.data();
                return {
                    id: doc.id,
                    name: nombre,
                    description: descripcion,
                    serie: series,
                    repetitions: repeticiones,
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
                serie: formData.serie,
                repeticion: formData.repetitions,
                ejercicios: exerciseRefs, // Utiliza referencias a los documentos de ejercicios
            });

            console.log("Documento escrito con ID: ", docRef.id);

            // Consulta Firestore para obtener la referencia al documento de membresía seleccionado
            let exerciseIdRef = null;
            const exerciseIdCollection = collection(db, "ejercicio");
            const exerciseIdQuery = query(
                exerciseIdCollection,
                where("tipo", "==", formData.exercise) // Consulta la membresía con el nombre seleccionado
            );
            const exerciseSnapshot = await getDocs(exerciseIdQuery);

            if (!exerciseSnapshot.empty) {
                exerciseSnapshot.forEach((doc) => {
                    exerciseIdRef = doc.ref; // Obtén la referencia al documento de membresía
                });
            } else {
                console.error("No se encontró la membresía seleccionada.");
                return;
            }

            // Agrega los datos a la colección "clienteMembresia" con la referencia a la membresía
            await addDoc(collection(db, "rutina"), {
                ejercicioId: exerciseIdRef, // Usar la referencia al documento de membresía
            });

            // Limpia el formulario después de la presentación exitosa
            setFormData({
                name: "",
                description: "",
                serie: "",
                repetitions: "",
                exercise: "",
            });

            setSelectedExerciseIds([]);
            handleTextareaClear();
            // Cierra el modal o realiza cualquier otra acción necesaria 
            handleCloseRoutineModal();

        } catch (error) {
            console.error("Error al agregar el documento: ", error);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
    const handlerRoutine = () => {
        setIsRoutineModalOpen(true);
    };

    const handleCloseRoutineModal = () => {
        handleTextareaClear();
        setIsRoutineModalOpen(false);
    };
    const closeModal = () => {
        handleAddRoutine();
        setShowModal(false);
        setIsRoutineModalOpen(false);
    };


    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [textareaValue, setTextareaValue] = useState<string>('');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        if (selectedOption) {
            setSelectedExerciseIds((prevIds) => [...prevIds, selectedOption]);
            setTextareaValue((prevValue) => prevValue + selectedOption + '\n');
        }
    };



    const handleOptionRemove = (id: string) => {
        const updatedSelectedExerciseIds = selectedExerciseIds.filter((exerciseId) => exerciseId !== id);
        setSelectedExerciseIds(updatedSelectedExerciseIds);

        // Actualiza el contenido del textarea
        setTextareaValue(updatedSelectedExerciseIds.join('\n') + '\n');
    };


    const handleTextareaClear = () => {
        setSelectedOptions([]);
        setTextareaValue('');
        setShowModal(true);
    };

    return (
        <BaseLayout>
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
                                        <EditIcon className="edit-icon" />
                                        <DeleteIcon className="delete-icon"
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
                        <span className="close-addRoutine " onClick={handleCloseRoutineModal}>&times;</span>
                        <div className="">
                            <div>
                                <div>
                                    <h2 className="service-titles">Crear Rutinas</h2>
                                </div>
                                <div className="line-addRoutine"></div>
                                <div className="">
                                    <h2 className="text-addRoutiner">Nombre De La Rutina</h2>
                                    <input type="text" className="info-addRoutine" placeholder="Nombre" value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                            </div>
                            <div className="">
                                <h2 className="text-addRoutine">Descripcion</h2>
                                <textarea name="descrption" placeholder="Descripcion" className="description-addRoutine" value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="line-addRoutine"></div>
                            <div className="">
                                <h2 className="text-addRoutiner">Series Del Ejercicio</h2>
                                <input type="text" className="info-addRoutine" placeholder="Series" value={formData.serie}
                                    onChange={(e) => setFormData({ ...formData, serie: e.target.value })} />
                            </div>
                            <div className="line-addRoutine"></div>
                            <div className="">
                                <h2 className="text-addRoutiner">Repeticiones Del Ejercicio</h2>
                                <input type="text" className="info-addRoutine" placeholder="Nombre" value={formData.repetitions}
                                    onChange={(e) => setFormData({ ...formData, repetitions: e.target.value })} />
                            </div>
                            <div className="line-addRoutine"></div>
                            <div>
                                <select
                                    className="inputformC1"
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
        </BaseLayout>
    );
}
