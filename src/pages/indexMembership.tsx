import BaseLayout from "@/pages/Sidebar/BaseLayout";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from '@mui/icons-material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/config";
import { initializeApp } from "firebase/app";

export interface TableData {
    id: string;
    type: string;
    price: string;
    description: string;
}



export default function MembershipPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TableData | null>(null);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [memberIdToDelete, setMemberIdToDelete] = useState('');

    const [formData, setFormData] = useState({
        type: "",
        price: "",
        description: "",
    });

    const handleAddMember = async () => {
        try {
            // Agrega los datos del formulario a la colección "membresia" en Firestore
            const docRef = await addDoc(collection(db, "membresia"), {
                tipo: formData.type,
                precio: formData.price,
                descripcion: formData.description,
            });

            console.log("Documento escrito con ID: ", docRef.id);

            // Limpia el formulario después de la presentación exitosa
            setFormData({
                type: "",
                price: "",
                description: "",
            });

        } catch (error) {
            console.error("Error al agregar el documento: ", error);
        }
    };

    useEffect(() => {
        const memberCollection = collection(db, 'membresia');
        const q = query(memberCollection);

        // Crea un oyente en tiempo real para la colección de membresia
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                const { precio, tipo, descripcion } = doc.data();
                return {
                    id: doc.id,
                    type: tipo,
                    price: precio,
                    description: descripcion,
                };
            });

            const filteredData = data.filter((member) =>
                member.type.toLowerCase().includes(searchQuery.toLowerCase())

            );

            setTableData(filteredData);

        });

        // Limpiar el oyente cuando el componente se desmonta   
        return () => {
            unsubscribe();
        };
    }, [app, searchQuery]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

    };

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
        handleAddMember();
        setShowModal(false);
        setIsMembershipModalOpen(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const editMember = async (member: TableData) => {
        try {


            setSelectedMember({
                ...member,
            });

            setShowModalEdit(true);
        } catch (error) {
            console.error('Error al obtener los datos de clienteMembresia:', error);
        }

    };

    const saveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMember) {
            console.error('No se ha seleccionado ningún membresia.');
            return;
        }

        try {
            const db = getFirestore(app);
            const memberRef = doc(db, 'membresia', selectedMember.id.toString());
            await updateDoc(memberRef, {
                tipo: selectedMember.type,
                precio: selectedMember.price,
                descripcion: selectedMember.description,
            });


            setShowModalEdit(false);
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };

    const cancelEdit = () => {
        setShowModalEdit(false);
    };

    const handleDeleteConfirmation = (memberId: string) => {
        setIsDeleteConfirmationOpen(true);
        setMemberIdToDelete(memberId);
    };

    const confirmDeleteMember = async (memberId: string) => {
        try {
            await deleteMember(memberId); // Llama a la función para eliminar la membresía
            setIsDeleteConfirmationOpen(false); // Cierra el modal de confirmación
        } catch (error) {
            console.error('Error al eliminar la membresía:', error);
        }
    };

    const cancelDeleteMember = () => {
        setIsDeleteConfirmationOpen(false); // Cierra el modal de confirmación
    };


    //eliminar membresia
    const deleteMember = async (memberId: string) => {
        try {
            // referencia al documento de membresia
            const memberRef = doc(db, 'membresia', memberId);

            // Verifica si el ID de la membresía está siendo utilizado en "clienteMembresia"
            const clientMembershipQuery = query(
                collection(db, 'clienteMembresia'),
                where('membershipId', '==', memberRef)
            );

            const clientMembershipDocs = await getDocs(clientMembershipQuery);

            if (clientMembershipDocs.size > 0) {
                alert("No se puede eliminar porque está siendo utilizado en la colección clienteMembresia.");
            } else {
                await deleteDoc(memberRef);
            }
        } catch (error) {
            console.error('Error al eliminar la membresía:', error);
        }
    };

    return (
        <BaseLayout>
            <div className="hClient">
                <div className="ContaMember">
                    <div className='searchBill1'>
                        <h1 className="custom-labelExercise">Membresias</h1>
                        <button
                            onClick={handlerMembership}
                            className="btnMember">
                            + Agregar Membresias
                        </button>
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
                            placeholder="Buscar Membresia"
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
            <div className="tableMember-container">
                <table className="tableMember">
                    <thead>
                        <tr className="fixed-header-row">
                            <th className="th-tableMember">Nombre</th>
                            <th className="th-tableMember">Precio</th>
                            <th className="th-tableMember">Descripción</th>
                            <th className="th-tableMember">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((member, index) => (
                                <tr key={index} className="tableMember-row">
                                    <td>{member.type}</td>
                                    <td>{member.price}</td>
                                    <td>{member.description}</td>
                                    <td>
                                        <EditIcon className="edit-icon" onClick={() => editMember(member)} />
                                        <DeleteIcon className="delete-icon" onClick={() => handleDeleteConfirmation(member.id)}
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

            {isMembershipModalOpen && (
                <div className="modal-addMember">
                    <div className="content-addMember">
                        <span className="close-addRoutine " onClick={handleCloseMembershipModal}>&times;</span>
                        <div className="">
                            <div>
                                <div>
                                    <h2 className="service-titles">Agregar Membresia </h2>
                                </div>
                                <div className="line-addMember"></div>
                                <div className="">
                                    <label htmlFor="Nombre" className="text-addMember">Tipo de Membresia</label>
                                    <input type="text" className="info-addMember" placeholder="Tipo" value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                                </div>
                            </div>
                            <div className="">
                                <h2 className="text-addMember">Descripcion</h2>
                                <textarea name="descrption" placeholder="Descripcion" className="description-addMember" value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="line-addMember"></div>
                            <div className="">
                                <h2 className="text-addMember">Precio</h2>
                                <input type="text" className="info-addMember" placeholder="$" value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="line-addMember"></div>
                            <button className="saveExerc-button" onClick={handleTextareaClear}>Agregar </button>
                            <button className="cancelExerc-button" onClick={handleCloseMembershipModal}>Cancelar</button>

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

            {showModalEdit && selectedMember && (
                <div className="modal-addMember">
                    <div className="content-addMember">
                        <span className="close-addRoutine " onClick={handleCloseMembershipModal}>&times;</span>
                        <div className="">
                            <div>
                                <h2 className="service-titles">Agregar Membresia </h2>
                            </div>
                            <form onSubmit={saveChanges} className="">
                                <div>
                                    <div className="line-addMember"></div>
                                    <div className="">

                                        <label htmlFor="Nombre" className="text-addMember">Tipo de Membresia</label>
                                        <input type="text" className="info-addMember" placeholder="Tipo"
                                            value={selectedMember.type}
                                            onChange={(e) => {
                                                setSelectedMember({ ...selectedMember, type: e.target.value });
                                            }} />
                                    </div>
                                </div>
                                <div className="">
                                    <h2 className="text-addMember">Descripcion</h2>
                                    <textarea name="descrption" placeholder="Descripcion" className="description-addMember" value={selectedMember.description}
                                        onChange={(e) => {
                                            setSelectedMember({ ...selectedMember, description: e.target.value });
                                        }}></textarea>
                                </div>
                                <div className="line-addMember"></div>
                                <div className="">
                                    <h2 className="text-addMember">Precio</h2>
                                    <input type="text" className="info-addMember" placeholder="$" value={selectedMember.price}
                                        onChange={(e) => {
                                            setSelectedMember({ ...selectedMember, price: e.target.value });
                                        }} />
                                </div>
                                <div className="line-addMember"></div>
                                <button className="saveExerc-button" onClick={saveChanges}>
                                    Actualizar
                                </button>
                                <button className="cancelExerc-button" onClick={cancelEdit}>
                                    Cancelar
                                </button>

                                {showModal && (
                                    <div className="modal">
                                        <div className="modal-content">
                                            <p>Se agrego nueva Membresia</p>
                                            <button className="button-addRoutine colors" onClick={closeModal}>Listo</button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                    </div>
                </div>
            )}
            {isDeleteConfirmationOpen && (
                <div className="modal-delete">
                <div className="custom-modal-delete">
                    <p className='text-delete'>¿Está seguro de que desea eliminar esta membresía?</p>
                    <button className="confirmDelete" onClick={() => confirmDeleteMember(memberIdToDelete)}>Si</button>
                    <button className="cancelDelete" onClick={() => cancelDeleteMember()}>No</button>
                </div>
                </div>
            )}

        </BaseLayout>
    );
}
