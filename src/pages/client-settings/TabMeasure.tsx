import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';
import { useRouter } from 'next/router';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { MdAddCircle } from "react-icons/md";

export default function TabMeasure() {
  const [estatura, setEstatura] = useState<number>(0);
  const [peso, setPeso] = useState<number>(0);
  const [cintura, setCintura] = useState<number>(0);
  const [cadera, setCadera] = useState<number>(0);
  const [pecho, setPecho] = useState<number>(0);
  const [abdomen, setAbdomen] = useState<number>(0);
  const [hombroD, setHombroD] = useState<number>(0);
  const [hombroI, setHombroI] = useState<number>(0);
  const [bicepD, setBicepD] = useState<number>(0);
  const [bicepI, setBicepI] = useState<number>(0);
  const [bicepDC, setBicepDC] = useState<number>(0);
  const [bicepIC, setBicepIC] = useState<number>(0);
  const [antebrD, setAntebrD] = useState<number>(0);
  const [antebrI, setAntebrI] = useState<number>(0);
  const [munecaD, setMunecaD] = useState<number>(0);
  const [munecaI, setMunecaI] = useState<number>(0);
  const [musloD, setMusloD] = useState<number>(0);
  const [musloI, setMusloI] = useState<number>(0);
  const [gemeD, setGemeD] = useState<number>(0);
  const [gemeI, setGemeI] = useState<number>(0);
  const [tricepD, setTricepD] = useState<number>(0);
  const [tricepI, setTricepI] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const router = useRouter();
  const { id } = router.query; // Obtenemos el ID del cliente de los parámetros de la URL
  const clienteRef = id ? doc(getFirestore(), 'cliente', id as string) : null; // Obtener la referencia al documento del cliente
  const [measures, setMeasures] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, measureId: string) => {
    setAnchorEl((prev) => ({ ...prev, [measureId]: event.currentTarget }));
  };

  const handleMenuClose = (measureId: string) => {
    setAnchorEl((prev) => ({ ...prev, [measureId]: null }));
  };

  useEffect(() => {
    const fetchMeasures = async () => {
      try {
        const app: FirebaseApp = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Obtener la referencia al documento del cliente
        const clienteRef = id ? doc(db, 'cliente', id as string) : null;

        // Consulta para obtener las medidas del cliente
        const measuresQuery = query(
          collection(db, 'clienteMedidas'),
          where('clienteId', '==', clienteRef)
        );

        // Obtener los documentos de medidas y sus cambios en tiempo real
        const unsubscribe = onSnapshot(measuresQuery, (snapshot) => {
          const measuresData: any[] = [];
          snapshot.forEach((doc) => {
            measuresData.push({ id: doc.id, ...doc.data() });
          });
          setMeasures(measuresData);
        });

        return () => {
          // Limpiar el listener cuando el componente se desmonte
          unsubscribe();
        };
      } catch (error) {
        console.error('Error al obtener las medidas:', error);
      }
    };

    fetchMeasures();
  }, [id]);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  // Guardar medidas
  const saveMeasures = async () => {
    try {
      if (id) {
        const app: FirebaseApp = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const medidasCollection = collection(db, 'clienteMedidas');
        const medidasDocRef = await addDoc(medidasCollection, {
          clienteId: clienteRef,
          fecha: selectedDate,
          estatura,
          peso,
          cintura,
          cadera,
          pecho,
          abdomen,
          hombroD,
          hombroI,
          bicepD,
          bicepI,
          bicepDC,
          bicepIC,
          antebrD,
          antebrI,
          munecaD,
          munecaI,
          musloD,
          musloI,
          gemeD,
          gemeI,
          tricepD,
          tricepI,
        });

        console.log('Medidas guardadas correctamente:', medidasDocRef.id);
      }
    } catch (error) {
      console.error('Error al guardar las medidas:', error);
    }
  };

  const handleSave = () => {
    saveMeasures();
    handleClose();
  };

  //eliminar medida
  const handleDeleteMeasure = async (measureId: string) => {
    try {
      const app: FirebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      const measureDocRef = doc(db, 'clienteMedidas', measureId);
      await deleteDoc(measureDocRef);

      console.log('Medida eliminada correctamente:', measureId);
    } catch (error) {
      console.error('Error al eliminar la medida:', error);
    }
  };

  const formatDate = (dateString: string, measureId: string) => {
    const date = new Date(dateString);
    return { date: date.toLocaleDateString(), id: measureId };
  };

  const columns = [
    { title: 'Fecha', key: 'fecha' },
    { title: 'Estatura', key: 'estatura' },
    { title: 'Peso', key: 'peso' },
    { title: 'Cintura', key: 'cintura' },
    { title: 'Cadera', key: 'cadera' },
    { title: 'Pecho', key: 'pecho' },
    { title: 'Abdomen', key: 'abdomen' },
    { title: 'Hombro Der', key: 'hombroD' },
    { title: 'Hombro Izq', key: 'hombroI' },
    { title: 'Bicep Der Relajado', key: 'bicepD' },
    { title: 'Bicep Izq Relajado', key: 'bicepI' },
    { title: 'Bicep Der Contraído', key: 'bicepDC' },
    { title: 'Bicep Izq Contraído', key: 'bicepIC' },
    { title: 'Antebrazo Der', key: 'antebrD' },
    { title: 'Antebrazo Izq', key: 'antebrI' },
    { title: 'Muñeca Der', key: 'munecaD' },
    { title: 'Muñeca Izq', key: 'munecaI' },
    { title: 'Muslo Der', key: 'musloD' },
    { title: 'Muslo Izq', key: 'musloI' },
    { title: 'Gemelos Der', key: 'gemeD' },
    { title: 'Gemelos Izq', key: 'gemeI' },
    { title: 'Tricep Der', key: 'tricepD' },
    { title: 'Tricep Izq', key: 'tricepI' },
  ];
  return (
    <>
      <div>
        <button className='btnMeasure' onClick={handleOpen}>
          <MdAddCircle style={{ fontSize: '22px', marginTop: '-1px', marginRight: '5px' }} />
          Agregar medidas
        </button>
      </div>
      <div className="tableMeasure">
        <table className="custom-tableMe">
          <tbody>
            {columns.map((column) => (
              <tr key={column.key}>
                <td>{column.title}</td>
                {measures.map((measure) => (
                  <td key={measure.id}>
                    {column.key === 'fecha' ? (
                      <>
                        <span>{formatDate(measure[column.key], measure.id).date}</span>
                        <IconButton onClick={(event) => handleMenuOpen(event, measure.id)}
                          className="more-options-icon"

                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl[measure.id]}
                          open={Boolean(anchorEl[measure.id])}
                          onClose={() => handleMenuClose(measure.id)}
                        >
                          <MenuItem
                            onClick={() => handleDeleteMeasure(measure.id)}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            <MdOutlineDeleteOutline style={{ fontSize: '18px', marginRight: '2px', marginTop: '-2px' }} /> Borrar
                          </MenuItem>
                        </Menu>
                      </>
                    ) : (measure[column.key])}
                  </td>
                ))}
              </tr>
            ))}

          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modalMeasure">
          <div className="modalMeasure-content">
            <div className="measureHader">
              <h2>Agregar Medidas</h2>
              <input
                className="measureDate"
                type="date"
                placeholder="Fecha"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Estatura</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={estatura}
                  onChange={(e) => setEstatura(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Peso</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={peso}
                  onChange={(e) => setPeso(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Cintura</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={cintura}
                  onChange={(e) => setCintura(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Cadera</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={cadera}
                  onChange={(e) => setCadera(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Pecho</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={pecho}
                  onChange={(e) => setPecho(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Abdomen</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={abdomen}
                  onChange={(e) => setAbdomen(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Hombro Der</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={hombroD}
                  onChange={(e) => setHombroD(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Hombro Izq</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={hombroI}
                  onChange={(e) => setHombroI(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Bicep Der Relajado</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={bicepD}
                  onChange={(e) => setBicepD(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Bicep Izq Relajado</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={bicepI}
                  onChange={(e) => setBicepI(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Bicep Der Contraído</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={bicepDC}
                  onChange={(e) => setBicepDC(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Bicep Izq Contraído</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={bicepIC}
                  onChange={(e) => setBicepIC(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Antebrazo Der</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={antebrD}
                  onChange={(e) => setAntebrD(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Antebrazo Izq</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={antebrI}
                  onChange={(e) => setAntebrI(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Muñeca Der</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={munecaD}
                  onChange={(e) => setMunecaD(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Muñeca Izq</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={munecaI}
                  onChange={(e) => setMunecaI(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Muslo Der</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={musloD}
                  onChange={(e) => setMusloD(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Muslo Izq</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={musloI}
                  onChange={(e) => setMusloI(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Gemelos Der</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={gemeD}
                  onChange={(e) => setGemeD(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Gemelos Izq</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={gemeI}
                  onChange={(e) => setGemeI(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="inputMed-row">
              <div className="inputMed-container">
                <label>Tricep Der</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={tricepD}
                  onChange={(e) => setTricepD(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputMed-container">
                <label>Tricep Izq</label>
                <input
                  className="inputMed"
                  type="number"
                  step="0.01"
                  value={tricepI}
                  onChange={(e) => setTricepI(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="buttonMeasure">
              <button className='MeasureSave' onClick={handleSave}>Guardar</button>
              <button className='MeasureCancel' onClick={handleClose}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
