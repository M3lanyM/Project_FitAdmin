import React, { ChangeEvent, useEffect, useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import 'react-datepicker/dist/react-datepicker.css';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminLayout from './AdminLayout/AdminLayout';
import { getFirestore, collection, query, onSnapshot, where, getDoc, getDocs, doc, addDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/config";
import { DocumentReference } from 'firebase/firestore';


export interface TableData {
    id: number;
    date: string;
    total: number;
}

interface Props {
    data?: TableData[];
}

export const initialData: TableData[] = [
    { id: 1, date: '2023-08-29', total: 100 },
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
    const tableData = data || initialData;
    const [invoiceCount, setInvoiceCount] = useState(0);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Sumar 1 ya que getMonth() devuelve un índice base cero
    const [descuento, setDescuento] = useState<number>(0);
    const [totalDescuento, setTotalDescuento] = useState<number>(0);
    const [totalPagar, setTotalPagar] = useState<number>(0);
    const [nombreEmpleado, setNombreEmpleado] = useState('');
    const [fechaFactura, setFechaFactura] = useState('');
    const [clienteId, setClienteId] = useState<DocumentReference | null>(null);

    useEffect(() => {
        // Recupera el recuento de facturas actual cuando se monta el componente
        const fetchInvoiceCount = async () => {
            const db = getFirestore(app);
            const facturaRef = collection(db, 'factura');

            try {
                const querySnapshot = await getDocs(facturaRef);
                setInvoiceCount(querySnapshot.size); // Establece el recuento según el número de documentos de la colección
            } catch (error) {
                console.error('Error fetching invoice count:', error);
            }
        };

        fetchInvoiceCount();
    }, []); // Run this effect only once when the component mounts

    const generateInvoiceNumber = () => {
        const sequentialNumber = (invoiceCount + 1).toString().padStart(3, '0');
        return `V-${currentYear}-${currentMonth.toString().padStart(2, '0')}-${sequentialNumber}`;
    };

    const handleDescuentoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const descuentoValue = parseFloat(e.target.value) || 0;
        setDescuento(descuentoValue);

        // Calcular el total de descuento
        const descuentoAmount = (descuentoValue / 100) * parseFloat(total);
        setTotalDescuento(Number(descuentoAmount));

        // Calcular el total a pagar
        const totalPagarAmount = parseFloat(total) - descuentoAmount;
        setTotalPagar(Number(totalPagarAmount));
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const openModalBill = () => {
        setIsModalBill(true);
    };

    const closeModalBill = () => {
        setIsModalBill(false);
        resetForm();
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

                // Actualiza el estado del clienteId con una referencia al documento del cliente
                setClienteId(doc(collection(db, 'cliente'), clientId));
                await findClientMembresia(clienteRef);
            } else {
                // Si no se encuentra un cliente, limpiar los campos de nombre y apellidos
                setNombre('');
                setApellidos('');
                setDescripcion('');
                setTotal('');
            }
        } catch (error) {
            console.error('Error al buscar cliente:', error);
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

    const handleSaveBill = async (e: React.FormEvent) => {
        e.preventDefault();
        const invoiceNumber = generateInvoiceNumber();
        // Crea un objeto con los datos de la factura
        const facturaData = {
            id: invoiceNumber,
            empleado: nombreEmpleado,
            fecha: fechaFactura,
            totalPagar: totalPagar.toFixed(2),
            descuento: descuento,
            clienteId: clienteId, // Utiliza la referencia al documento del cliente
        };
        const db = getFirestore(app);
        const facturaRef = collection(db, 'factura');


        try {
            // Agrega el documento a la colección "factura"
            const docRef = await addDoc(facturaRef, facturaData);

            // Actualizar el número secuencial de factura
            setInvoiceCount(invoiceCount + 1);
            resetForm();
            console.log('Factura guardada con ID:', docRef.id);
            setIsModalBill(false);
        } catch (error) {
            console.error('Error al guardar la factura:', error);
        }
    };

    const resetForm = () => {
        setNombreEmpleado('');
        setFechaFactura('');
        setCedula('');
        setNombre('');
        setApellidos('');
        setDescripcion('');
        setTotal('');
        setDescuento(0);
        setTotalDescuento(0);
        setTotalPagar(0);
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
                                    value={nombreEmpleado}
                                    onChange={(e) => setNombreEmpleado(e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <label>Fecha:</label>
                                <input
                                    className="personalInfo"
                                    type="date"
                                    placeholder="Fecha"
                                    value={fechaFactura}
                                    onChange={(e) => setFechaFactura(e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <label >N° factura:</label>
                                <input
                                    className="personalInfo"
                                    type="text"
                                    placeholder="factura"
                                    value={generateInvoiceNumber()}
                                    readOnly
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
                                <label>Próximo Pago:</label>
                                <input
                                    className="personalInfo"
                                    type="date"
                                    placeholder="Próximo Pago"
                                />
                            </div>
                            <div className="form-row">
                                <label>Membresía:</label>
                                <input
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
                                    type="nunber"
                                    placeholder="0"
                                    value={total}
                                    onChange={(e) => setTotal(e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <label >Descuento %:</label>
                                <input
                                    className="personalInfo"
                                    type="text"
                                    placeholder="0"
                                    value={descuento}
                                    onChange={handleDescuentoChange}
                                />
                            </div>
                            <div className="form-row">
                                <label >Total Descuento:</label>
                                <input
                                    className="personalInfo"
                                    type="number"
                                    placeholder="0.00"
                                    value={totalDescuento.toFixed(2)}
                                    readOnly
                                />
                            </div>
                            <div className="form-row">
                                <label >Total a pagar:</label>
                                <input
                                    className="personalInfo"
                                    type="number"
                                    placeholder="0.00"
                                    value={totalPagar.toFixed(2)}
                                    readOnly
                                />
                            </div>
                            <button className="save-button" onClick={handleSaveBill}>
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