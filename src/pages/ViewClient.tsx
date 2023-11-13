import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BaseLayout from '@/pages/Sidebar/BaseLayout';
import { getFirestore, doc, getDoc, DocumentSnapshot, collection, where, getDocs, query } from 'firebase/firestore';
import { initializeApp, FirebaseApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';
import { differenceInDays, parseISO } from 'date-fns'; // Importa las funciones para cálculos de fechas
import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Typography } from '@mui/material';
import { FaPencilRuler} from "react-icons/fa";
import TodayIcon from '@mui/icons-material/Today';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

import TabMembership from './client-settings/TabMembership';
import TabRoutine from './client-settings/TabRoutine';
import TabMeasure from './client-settings/TabMeasure';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
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

  const [member, setMember] = useState(false);
  /*Show the personal data section*/
  const handlerMember = () => {
    if (result === 0) {
      alert('Por favor, realice un calculo de precio');
      return;
    }
    setMember(true);
  }

  const [content, setContent] = useState<string>('Este es el contenido que deseas limpiar.');
  const [routine, setRoutine] = useState(false);
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
    <BaseLayout>
      <div className='hClient'>
        <div className='ContaVC'>
          <h1>Información del Cliente</h1>
          {client ? (
            <div>
              <p>ID: {client.cedula}</p>
              <p>Nombre: {`${client.nombre} ${client.primerApellido}`}</p>
              <p>Correo: {client.correo}</p>
              <p>Estado: {client.estado}</p>
              {/* ... (mostrar otras propiedades del cliente) */}
            </div>
          ) : (
            <p></p>
          )}
        </div>
        <div className="memberC">
          <h1>Membresía</h1>
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

      <Box className='tableClient-container' sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab icon={<ContentPasteIcon style={{ fontSize: 22 }}/>} iconPosition="start" label="Membresía" {...a11yProps(0)} />
            <Tab icon={<TodayIcon style={{ fontSize: 22 }}/>} iconPosition="start" label="Rutina"{...a11yProps(1)} />
            <Tab icon={<FaPencilRuler style={{ fontSize: 16 }} />} iconPosition="start" label="Medidas" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <TabMembership />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TabRoutine />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <TabMeasure />
        </CustomTabPanel>
      </Box>


    </BaseLayout>
  );
}
