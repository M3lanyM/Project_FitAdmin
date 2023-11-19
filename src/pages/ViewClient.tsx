import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc, DocumentSnapshot, collection, where, getDocs, query } from 'firebase/firestore';
import { initializeApp, FirebaseApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';
import { differenceInDays, parseISO } from 'date-fns'; // Importa las funciones para cálculos de fechas
import React from 'react';
import { FaPencilRuler} from "react-icons/fa";
import TodayIcon from '@mui/icons-material/Today';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { AppBar, ListItemIcon, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import TabPanel from './client-settings/TabPanel';
import TabMembership from './client-settings/TabMembership';
import TabRoutine from './client-settings/TabRoutine';
import TabMeasure from './client-settings/TabMeasure';
import AdminLayout from './AdminLayout/AdminLayout';

interface Client {
  nombre: string;
  cedula: string;
  primerApellido: string;
  correo: string;
  estado: string;
  admDate: "",
  nextPay: "",
  precio: "",
  membership: "",
}

export default function ClientInfoPage() {
  const router = useRouter();
  const { id } = router.query; // Obtenemos el ID del cliente de los parámetros de la URL
  const [client, setClient] = useState<Client | null>(null);
  const [fechaIngreso, setFechaIngreso] = useState<string | null>(null);
  const [diasRestantesParaPago, setDiasRestantesParaPago] = useState<number | null>(null); // Nuevo estado para los días restantes
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  //ver
  const [member, setMember] = useState(false);
  const [content, setContent] = useState<string>('Este es el contenido que deseas limpiar.');
  const [routine, setRoutine] = useState(false);

  const tabOptions = [
    { label: 'Membresía', component: <TabMembership /> },
    { label: 'Rutina', component: <TabRoutine /> },
    { label: 'Medidas', component: <TabMeasure /> },
  ];

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const app: FirebaseApp = initializeApp(firebaseConfig);
          const db = getFirestore(app);
          const clientRef = doc(db, 'cliente', id as string); // Utiliza el ID del cliente de los parámetros de la URL
          const clientDoc: DocumentSnapshot = await getDoc(clientRef);

          if (clientDoc.exists()) {
            const clientData = clientDoc.data() as Client;
            setClient(clientData);

            // Consulta para obtener la fecha de ingreso desde clienteMembresia
            const clienteMembresiaCollection = collection(db, 'clienteMembresia');
            const membresiaQuery = query(clienteMembresiaCollection, where('clienteId', '==', clientRef));
            const membresiaSnapshot = await getDocs(membresiaQuery);

            if (!membresiaSnapshot.empty) {
              const membresiaDoc = membresiaSnapshot.docs[0];
              const membresiaData = membresiaDoc.data();
              setFechaIngreso(membresiaData.fechaIngreso);

              // Calcular los días restantes para el próximo pago
              const fechaProximoPago = parseISO(membresiaData.proximoPago);
              const diferenciaDias = differenceInDays(fechaProximoPago, new Date());
              setDiasRestantesParaPago(diferenciaDias);
            } else {
              console.error('El documento de clienteMembresia no existe.');
            }
          } else {
            console.error('El documento del cliente no existe.');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del cliente:', error);
      }
    };

    fetchClientData();
  }, [id]);

  const [result, setResult] = useState<number>(1);
  const [part, setPart] = useState(false);
  /*Show the personal data section*/
  const handlerPart = () => {
    if (result === 0) {
      alert('Por favor, realice un calculo de precio');
      return;
    }
    setPart(true);
  }

  /*Show the personal data section*/
  const handlerMember = () => {
    if (result === 0) {
      alert('Por favor, realice un calculo de precio');
      return;
    }
    setMember(true);
  }


  /*Show the personal data section*/
  const handlerRoutine = () => {
    if (result === 0) {
      alert('Por favor, realice un calculo de precio');
      return;
    }
    setRoutine(true);
    setContent('');
  }


  return (
    <AdminLayout>
      <div className='hClient'>
        <div className='ContaVC'>
          <h1 className='TitleCV'>Información del Cliente</h1>
          {client ? (
            <div>
              <p>ID: {client.cedula}</p>
              <p>Nombre: {`${client.nombre} ${client.primerApellido}`}</p>
              <p>Correo: {client.correo}</p>
              <p>Estado: {client.estado}</p>
            </div>
          ) : (
            <p></p>
          )}
        </div>
        <div className="memberVC">
          <h1 className='TitleCV'>Membresía</h1>
          <p>Fecha de ingreso: {fechaIngreso}</p>
          <div>
            {diasRestantesParaPago !== null ? (
              <p>Próximo pago en: {diasRestantesParaPago} días</p>
            ) : (
              <p>Fecha de próximo pago no disponible</p>
            )}
            <p>FPrecio: /mensual</p>

          </div>
        </div>
      </div>
      <div className='TAB'>
        <Box sx={{ width: '100%' }}>
        <AppBar position="static" sx={{ background: '#ffffff', boxShadow: 'none', borderBottom: '1px solid #ccc', alignItems: 'start' }}>
            <Tabs value={value} onChange={handleChange} centered>
              {tabOptions.map((option, index) => (
               <Tab
               key={index}
               label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ marginRight: '-28px' }}>
                     {index === 0 && <ContentPasteIcon sx={{ fontSize: 21 }} />}  {/* Icono para la primera pestaña */}
                     {index === 1 && <TodayIcon sx={{ fontSize: 23 }} />}  {/* Icono para la segunda pestaña */}
                     {index === 2 && <FaPencilRuler  size={16}  />}  {/* Icono para la tercera pestaña */}
                   </ListItemIcon>
                   <Typography style={{ color: '#6B6B6B', fontSize: '17px' }}>{option.label}</Typography>
                 </Box>
               }
             />
           ))}
            </Tabs>
          </AppBar>
          {tabOptions.map((option, index) => (
            <TabPanel key={index} value={value} index={index}>
              {option.component}
            </TabPanel>
          ))}
        </Box>
      </div>
    </AdminLayout>
  );
}
