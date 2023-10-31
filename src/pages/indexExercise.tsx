import BaseLayout from "@/pages/Sidebar/BaseLayout";
import { IconButton, InputAdornment, TextField, TextareaAutosize } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from '@mui/icons-material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/config";
import { initializeApp } from "firebase/app";


interface TableData {
    id: string;
    name: string;
    description: string;
}


export default function ExercisePage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [exerciseIdToDelete, setExerciseIdToDelete] = useState('');
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<TableData | null>(null);


    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const handleAddAExercise = async () => {
        try {
            // Agrega los datos del formulario a la colección "membresia" en Firestore
            const docRef = await addDoc(collection(db, "ejercicio"), {
                nombre: formData.name,
                descripcion: formData.description,
            });

            console.log("Documento escrito con ID: ", docRef.id);

            // Limpia el formulario después de la presentación exitosa
            setFormData({
                name: "",
                description: "",
            });

        } catch (error) {
            console.error("Error al agregar el documento: ", error);
        }
    };

    useEffect(() => {
        const exerciseCollection = collection(db, 'ejercicio');
        const q = query(exerciseCollection);

        // Crea un oyente en tiempo real para la colección de membresia
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                const { nombre, categoria, descripcion } = doc.data();
                return {
                    id: doc.id,
                    name: nombre,
                    category: categoria,
                    description: descripcion,
                };
            });

            const filteredData = data.filter((exercise) =>
                exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setTableData(filteredData);

        });

        // Limpiar el oyente cuando el componente se desmonta   
        return () => {
            unsubscribe();
        };
    }, [app, searchQuery]);


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

    const handleTextareaClear = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        handleAddAExercise();
        setShowModal(false);
        setIsExerciseModalOpen(false);
    };

    const editExercise = async (exercise: TableData) => {
        try {


            setSelectedExercise({
                ...exercise,
            });

            setShowModalEdit(true);
        } catch (error) {
            console.error('Error al obtener los datos de clienteMembresia:', error);
        }

    };

    const saveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedExercise) {
            console.error('No se ha seleccionado ningún membresia.');
            return;
        }

        try {
            const db = getFirestore(app);
            const memberRef = doc(db, 'ejercicio', selectedExercise.id.toString());
            await updateDoc(memberRef, {
                nombre: selectedExercise.name,
                descripcion: selectedExercise.description,
            });


            setShowModalEdit(false);
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };

    const cancelEdit = () => {
        setShowModalEdit(false);
    };

    return (
        <BaseLayout>
            <div className='hBill'>
                <div className='ContaRoutine'>
                    <div className='searchBill1'>
                        <label className="custom-labelExercise">Ejercicios</label>
                        <button className="btnExercise" onClick={handlerExercise}>+ Agregar Ejercicio</button>
                    </div>
                    <div className='searchBill'>
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
                                width: '129%', height: '1%',
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#A1A626',
                                },
                                bottom: '-33%', right: '115%',
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                            .map((exercise, index) => (
                                <tr key={index} className="tableMember-row">
                                    <td>{exercise.name}</td>
                                    <td>{exercise.description}</td>
                                    <td>
                                        <EditIcon className="edit-icon" onClick={() => editExercise(exercise)} />
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
                <div className="modalEditExerc">
                    <div className="modalEditExerc-content">
                        <h2 className="personalExerc-title">Agregar Ejercicio</h2>
                        <div className="form-row">
                            <h2 className="Exercise-title" >Nombre del Ejercicio:</h2>
                            <input
                                type="text"
                                className="personalExerc"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <h2 className="Exercise-title">Descripción</h2>
                            <textarea
                                name="description"
                                placeholder="Descripcion"
                                className="descripcion-data"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>
                        <button className="saveExerc-button"
                            onClick={handleTextareaClear}>
                            Agregar
                        </button>
                        <button className="cancelExerc-button"
                            onClick={handleCloseRoutineModal}>
                            Cancelar
                        </button>

                        {showModal && (
                            <div className="modal-ready">
                                <div className="custom-modal-ready">
                                    <p className='text-ready'>Se agrego el nuevo ejercicio</p>
                                    <button className="confirmReady" onClick={closeModal}>Listo</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showModalEdit && selectedExercise && (
                <div className="modalEditExerc">
                    <div className="modalEditExerc-content">
                        <h2 className="personalExerc-title">Editar Ejercicio </h2>

                        <form onSubmit={saveChanges} className="">
                            <div className="line-addRoutine"></div>
                            <div className="form-row">
                                <h2 className="Exercise-title" >Nombre Del Ejercicio</h2>
                                <input
                                    type="text"
                                    className="personalExerc"
                                    placeholder="Nombre"
                                    value={selectedExercise.name}
                                    onChange={(e) => {
                                        setSelectedExercise({ ...selectedExercise, name: e.target.value });
                                    }} />
                            </div>
                            <div className="form-row">
                                <h2 className="Exercise-title">Descripcion</h2>
                                <textarea
                                    name="descrption"
                                    placeholder="Descripcion"
                                    className="descripcion-data"
                                    value={selectedExercise.description}
                                    onChange={(e) => {
                                        setSelectedExercise({ ...selectedExercise, description: e.target.value });
                                    }}>

                                </textarea>
                            </div>
                            <div className="line-addRoutine"></div>
                            <button className="saveExerc-button" onClick={saveChanges}>
                                Actualizar
                            </button>
                            <button className="cancelExerc-button" onClick={cancelEdit}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </BaseLayout >
    );
}
