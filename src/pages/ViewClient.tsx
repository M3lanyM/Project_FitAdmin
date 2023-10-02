import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BaseLayout from '@/pages/Sidebar/BaseLayout';
import { getFirestore, doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { initializeApp, FirebaseApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';

interface Client {
  nombre: string;
  primerApellido: string;
  correo: string;
  estado: string;
  // Otras propiedades del cliente
}

export default function ClientInfoPage() {
  const router = useRouter();
  const { id } = router.query; // Obtenemos el ID del cliente de los parámetros de la URL
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const app: FirebaseApp = initializeApp(firebaseConfig);
          const db = getFirestore(app);
          const clientRef = doc(db, 'cliente');
          const clientDoc: DocumentSnapshot = await getDoc(clientRef);

          if (clientDoc.exists()) {
            const clientData = clientDoc.data() as Client;
            setClient(clientData);
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
              <p>ID: {id}</p>
              <p>Nombre: {`${client.nombre} ${client.primerApellido}`}</p>
              <p>Correo: {client.correo}</p>
              <p>Estado: {client.estado}</p>
              {/* ... (mostrar otras propiedades del cliente) */}
            </div>
          ) : (
            <p>ID:{id}</p>
          )}
        </div>
        <div className="memberC">
        </div>
      </div>

      <div className="tableClient-container">
        <div className='Descarga'>
          <button className="button-client" onClick={handlerPart} > Historial </button>
          <button className="button-client" onClick={handlerMember}> Membresia </button>
          <button className="button-client" onClick={handlerRoutine}> Rutinas </button>
          <button className="button-client" > Medidas </button>
        </div>
        <div className="line-addRoutine"></div>
        {part && (
          <section className="container-personal grid grid-cols-1 gap-4">
            <div>
              <label className="label1-price" form="email">Historial del Cliente</label>
            </div>
          </section>
        )}
        {member && (
          <section className="container-personal grid grid-cols-1 gap-4">
            <div>
              <label className="label1-price" form="email">Membresia</label>
            </div>
          </section>
        )}
        {routine && (
          <section className="container-personal grid grid-cols-1 gap-4">
            <div>
              <label className="label1-price" form="email">Rutinas</label>
            </div>
          </section>
        )}
      </div>
    </BaseLayout>
  );
}
