import BaseLayout from "@/pages/Sidebar/BaseLayout";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from '@mui/icons-material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { addDoc, collection, getDocs, getFirestore, onSnapshot, query } from "firebase/firestore";
import firebaseConfig from "@/firebase/config";
import { initializeApp } from "firebase/app";

export interface TableData {
    id: String;
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
    const [membershipOptions, setMembershipOptions] = useState<string[]>([]);


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
      )=> {
        
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
                            placeholder="Buscar Membresia"
                            sx={{
                                width: '85%',
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#2b8c8c',
                                },
                                marginRight: '300px',
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
                                    <label htmlFor="Nombre" className="text-addRoutiner">Tipo de Membresia</label>
                                    <input type="text" className="info-addRoutine" placeholder="Tipo" value={formData.type} 
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}/>
                                </div>
                            </div>
                            <div className="">
                                <h2 className="text-addRoutine">Descripcion</h2>
                                <textarea name="descrption" placeholder="Descripcion" className="description-addRoutine" value={formData.description} 
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="line-addRoutine"></div>
                            <div className="">
                                <h2 className="text-addRoutiner">Precio</h2>
                                <input type="text" className="info-addRoutine" placeholder="$" value={formData.price} 
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}/>
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
