import React, { ChangeEvent, useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import 'react-datepicker/dist/react-datepicker.css';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminLayout from './AdminLayout/AdminLayout';
import { getFirestore, collection, query, onSnapshot, where, getDoc, getDocs, doc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/config";
import { DocumentReference } from 'firebase/firestore';


export interface TableData {
    id: number;
    client: string;
    date: string;
    total: number;
}

interface Props {
    data?: TableData[];
}
// Definir una interfaz que represente la estructura de los documentos de membresía
interface Membresia {
    tipo: string;
    precio: string;
}
export const initialData: TableData[] = [
    { id: 1, client: 'John Doe', total: 100, date: '2023-08-29' },
    // ... other data
];

export default function BillPage({ data }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalBill, setIsModalBill] = useState(false);
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const app = initializeApp(firebaseConfig);
    const [descripcion, setDescripcion] = useState('');
    const [total, setTotal] = useState('');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const tableData = data || initialData;

    const openModalBill = () => {
        setIsModalBill(true);
    };

    const closeModalBill = () => {
        setIsModalBill(false);
    };

    const handleCedulaChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const cedulaValue = e.target.value;
        setCedula(cedulaValue);

        // Configura la referencia a la colección "cliente"
        const db = getFirestore(app);
        const clienteRef = collection(db, 'cliente');

        // Crea la consulta para buscar el cliente por cédula
        const q = query(clienteRef, where('cedula', '==', cedulaValue));

        try {
            // Realiza la consulta a la base de datos
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Si se encuentra un cliente con la cédula proporcionada, llenar los campos de nombre y apellidos
                const clienteData = querySnapshot.docs[0].data();
                setNombre(clienteData.nombre);
                setApellidos(clienteData.primerApellido);
                // Accede al primer documento de la consulta
                const clienteDoc = querySnapshot.docs[0];
                const clientId = clienteDoc.id;
                const clienteRef = doc(collection(db, 'cliente'), clientId);
                await findClientMembresia(clienteRef);
            } else {
                // Si no se encuentra un cliente, limpiar los campos de nombre y apellidos
                setNombre('');
                setApellidos('');
            }
        } catch (error) {
            // Manejo de errores: Imprime el error en la consola
            console.error('Error al buscar cliente:', error);
            // Puedes manejar el error de otras maneras aquí, como establecer un estado de error para mostrar al usuario.
        }
    };
    const findClientMembresia = async (clienteIdRef: DocumentReference) => {
        const db = getFirestore(app);
    
        try {
            // Realiza la consulta a la base de datos para obtener la membresía del cliente
            const querySnapshot = await getDocs(query(collection(db, 'clienteMembresia'), where('clienteId', '==', clienteIdRef)));
    
            if (!querySnapshot.empty) {
                const membresiaRef = querySnapshot.docs[0].data().membershipId;
    
                // Obtén los datos de la membresía utilizando la referencia
                const membresiaDoc = await getDoc(membresiaRef);
    
                if (membresiaDoc.exists()) {
                    // Si se encuentra la membresía en la colección 'membresia'
                    const membresiaData = membresiaDoc.data() as { precio: string, tipo: string };
                    setTotal(membresiaData.precio);
                    setDescripcion(membresiaData.tipo);
                } else {
                    console.log('No se encontró la membresía en la colección "membresia"');
                }
            } else {
                console.log('No se encontró ninguna membresía para la referencia de cliente');
            }
        } catch (error) {
            console.error('Error al buscar membresía del cliente:', error);
        }
    };
    
    

    


    return (
        <AdminLayout>
            <div className='hBill'>
                <div className='ContaBill'>
                    <label className="custom-labelBill">FACTURACIÓN</label>
                    <label htmlFor="Nombre" className="labelBill">
                        Seleccione la fecha a buscar:
                    </label>

                    <div className='searchBill'>
                        <input
                            className="starDate"
                            type="date"
                            name="starDate"
                            placeholder="Fecha de Nacimiento"
                        />
                        <TextField
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon className="SearchIcon" />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Buscar cliente"
                            sx={{
                                width: '80%', height: '1%',
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#2b8c8c',
                                },
                                marginTop: '3%', marginLeft: '20px',
                            }}
                        />
                    </div>
                </div>
                <div className="addBill">
                    <button onClick={openModalBill} className='btnaddBill'>
                        + Agregar Factura
                    </button>
                </div>
            </div>
            <div className="tableBill-container">
                <table className="tableBill">
                    <thead>
                        <tr className="fixed-header-row">
                            <th className="th-tableBill">N° factura</th>
                            <th className="th-tableBill">Cliente</th>
                            <th className="th-tableBill">Fecha</th>
                            <th className="th-tableBill">Total</th>
                            <th className="th-tableBill">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <tr key={row.id} className="tableRoutine-row">
                                    <td>{row.id}</td>
                                    <td>{row.client}</td>
                                    <td>{row.date}</td>
                                    <td>{row.total}</td>
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
            {isModalBill && (
                <div className="modal-addMember">
                    <div className="content-addMember">
                        <span className="close-addRoutine " onClick={closeModalBill}>&times;</span>
                        <h2 className="personalInfo-title">FACTURA</h2>
                        <form className="form-grid">
                            <div className="form-row">
                                <label >Atendido por:</label>
                                <input
                                    className="personalInfo"
                                    type="text"
                                    placeholder="Nombre del empleado"
                                />
                            </div>
                            <div className="form-row">
                                <label>Fecha:</label>
                                <input
                                    className="personalInfo"
                                    type="date"
                                    placeholder="Fecha"
                                />
                            </div>
                            <div className="form-row">
                                <label >N° factura:</label>
                                <input
                                    className="personalInfo"
                                    type="text"
                                    placeholder="factura"
                                />
                            </div>
                            <div className="form-row">
                                <label >Cédula:</label>
                                <input
                                    className="personalInfo"
                                    type="text"
                                    placeholder="Cédula del cliente"
                                    value={cedula}
                                    onChange={handleCedulaChange}
                                />
                            </div>
                            <div className="form-row">
                                <label >Nombre:</label>
                                <input
                                    className="personalInfo"
                                    type="text"
                                    placeholder="Nombre del cliente"
                                    value={nombre}
                                    onChange={handleCedulaChange}

                                />
                            </div>
                            <div className="form-row">
                                <label >Apellidos:</label>
                                <input
                                    className="personalInfo"
                                    type="text"
                                    placeholder="Apellidos del cliente"
                                    value={apellidos}
                                    onChange={handleCedulaChange}

                                />
                            </div>
                            <div className="form-row">
                                <label >Cantidad:</label>
                                <input
                                    className="personalInfo"
                                    type="number"
                                    placeholder="Cantidad"
                                />
                            </div>
                            <div className="form-row">
                                <label>Descripción:</label>
                                <textarea
                                    name="descripcion"
                                    className="personalInfo"
                                    placeholder="Descripción"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <label>Total:</label>
                                <input
                                    className="personalInfo"
                                    type="text"
                                    placeholder="Total"
                                    value={total}
                                    onChange={(e) => setTotal(e.target.value)}
                                />
                            </div>
                            <button className="save-button" >
                                Guardar
                            </button>
                            <button className="Cancel-button" onClick={closeModalBill}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}