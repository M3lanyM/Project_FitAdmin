import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebaseConfig from "@/firebase/config";
import { initializeApp } from "firebase/app";
import { DocumentSnapshot, addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { TextField } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { DocumentData } from "firebase/firestore";
import { DocumentReference } from 'firebase/firestore';

interface Notes {
  [day: number]: string;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  series: string;
  repetitions: string;
}

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

interface CustomDocumentType extends Document {
  addParagraph(paragraph: Paragraph): void;
}

export default function TabRoutine() {

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const router = useRouter();
  const { id } = router.query;
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [notes, setNotes] = React.useState<Notes>({});
  const [isAssignRoutineModalOpen, setIsAssignRoutineModalOpen] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const currentMonthName = monthNames[currentMonth];
  const [selectedDay, setSelectedDay] = useState<number>(0); // Estado para almacenar el día seleccionado actualmente
  const [objectiveInput, setObjectiveInput] = useState<string>(''); // Estado para almacenar el objetivo introducido
  const [titleInput, setTitleInput] = useState<string>(''); // Estado para almacenar el objetivo introducido
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [category, SetCategory] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);


  // Obtener la referencia al documento del cliente
  const clienteRef = id ? doc(getFirestore(), 'cliente', id as string) : null;
  const routineCollection = collection(db, 'rutina');
  const clienteRutinaCollection = collection(db, 'clienteRutina');

  useEffect(() => {

    const q = query(routineCollection);


    // Crea un oyente en tiempo real para la colección de clientes
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        const { nombre, descripcion, serie, repeticion, ejercicios } = doc.data();
        return {
          id: doc.id,
          name: nombre,
          description: descripcion,
          series: serie,
          repetitions: repeticion,
          exercise: ejercicios
        };
      });
      setRoutines(data);

    });
    const loadClientRoutines = async () => {
      try {
        const clientRoutinesCollection = collection(db, 'clienteRutina');
        const querySnapshot = await getDocs(query(clientRoutinesCollection,
          where('clienteId', '==', clienteRef),
        ));

        const data: Record<number, string> = {};

        querySnapshot.forEach((doc) => {
          const { tituloRutina, fechaInicio, fechaFinal } = doc.data();
          const startDate = new Date(fechaInicio);
          const endDate = new Date(fechaFinal);

          const startDayOfWeek = startDate.getDay(); // Día de la semana de la fecha inicial

          // Encontrar el siguiente día de la semana igual al de la fecha inicial
          while (startDate <= endDate) {
            const dayOfMonth = startDate.getDate() + 1;
            const currentDayOfWeek = startDate.getDay();

            // Verificar si estamos en el mes y año correctos
            if (
              startDate.getMonth() === currentMonth &&
              startDate.getFullYear() === currentYear &&
              currentDayOfWeek === startDayOfWeek
            ) {
              data[dayOfMonth] = tituloRutina; // Asignar el título al día correspondiente
            }

            startDate.setDate(startDate.getDate() + 1); // Avanzar un día
          }
        });

        setNotes(data); // Establecer los títulos de las rutinas en los días correspondientes
      } catch (error) {
        console.error('Error al cargar las rutinas de los clientes:', error);
      }
    };

    loadClientRoutines();


    // Limpiar el oyente cuando el componente se desmonta   
    return () => {
      unsubscribe();
    };
  }, [app, currentMonth, currentYear]);

  const daysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartingDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = (): React.ReactNode => {
    const days = [];
    const totalDays = daysInMonth(currentYear, currentMonth);
    const startingDay = getStartingDayOfMonth(currentYear, currentMonth);


    const handleClick = async (day: number) => {
      setSelectedDay(day);

      try {
        const clientRoutinesCollection = collection(db, 'clienteRutina');

        const querySnapshot = await getDocs(
          query(
            clientRoutinesCollection
          )
        );

        querySnapshot.forEach((doc) => {
          setIsAssignRoutineModalOpen(true);
        });
      } catch (error) {
        console.error('Error al cargar la información de la rutina:', error);
      }
    };

    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="empty-day">
          {' '}
        </div>
      );
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(
        <div key={i} className="day" onClick={() => handleClick(i)}>
          {i}
          {notes[i] && <span className="note">{notes[i]}</span>}
        </div>
      );
    }

    return days;
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Do.', 'Lu.', 'Ma.', 'Mi.', 'Ju.', 'Vi.', 'Sa.'];

    return daysOfWeek.map((day) => (
      <div key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {day}
      </div>
    ));
  };

  const handlerAssignRoutine = (day: number) => {
    setSelectedDay(day); // Actualizar el día seleccionado
    setSelectedMonth(new Date().getMonth() + 1); // Actualizar el mes seleccionado
    setIsAssignRoutineModalOpen(true);

    // Verificar si hay información para el día seleccionado en notes
    const selectedDayInfo = notes[day];
    if (selectedDayInfo) {
      // Llenar el modal con la información correspondiente al día seleccionado
      const selectedRoutine = routines.find(routine => routine.id === selectedDayInfo);
      if (selectedRoutine) {
        setTitleInput(selectedRoutine.name || '');
        // Llenar otros campos del modal según sea necesario
      }
    } else {
      // Si no hay información, limpiar el contenido del modal
      setTitleInput('');
      setSelectedRoutine('');

      // Limpiar otros campos del modal según sea necesario
    }
  };


  const CloseAssignRoutine = () => {
    setIsAssignRoutineModalOpen(false);
  };

  const handleRoutineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoutine(event.target.value);
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handlePreviousMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleSaveObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const selectedRoutineDocRef = doc(db, 'rutina', selectedRoutine);
      const objetivoData = {
        clienteId: clienteRef,
        tituloRutina: titleInput,
        fechaInicio: startDate ? startDate.toISOString().split('T')[0] : '', // Guardar la fecha de inicio
        fechaFinal: endDate ? endDate.toISOString().split('T')[0] : '', // Guardar la fecha final
        objetivo: objectiveInput,
        categoria: category,
        rutinaSeleccionada: selectedRoutineDocRef // Asegúrate de obtener la rutina seleccionada
      };

      await addDoc(clienteRutinaCollection, objetivoData);

      setNotes(prevNotes => ({
        ...prevNotes,
        [startDate ? startDate.toISOString().split('T')[0] : '']: `     ${titleInput}`
      }));
      setIsAssignRoutineModalOpen(false);
      setTitleInput('');
      setObjectiveInput('');
      SetCategory('');
      setSelectedRoutine('');

    } catch (error) {
      console.error('Error al guardar el objetivo:', error);
    }
  };
  const generateWordDocument = async () => {
    try {
      const clientRoutinesCollection = collection(db, 'clienteRutina');
      const querySnapshot = await getDocs(query(clientRoutinesCollection,
        where('clienteId', '==', clienteRef),
      ));

      const data: Record<number, string> = {};

      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const { objetivo, fechaInicio, fechaFinal, rutinaSeleccionada, categoria } = doc.data();
        const startDate = fechaInicio;
        const endDate = fechaFinal;
        const idRutina = rutinaSeleccionada; // Reemplaza con el ID de la rutina real

        // Usamos await aquí para esperar la resolución de obtenerNombreRutina
        const nombreRutina = await obtenerNombreRutina(idRutina);
        if (rutinaSeleccionada) {
          const rutinaRef = rutinaSeleccionada as DocumentReference<DocumentData>;
          const rutinaDoc = await getDoc(rutinaRef);

          if (rutinaDoc.exists()) {
            const rutinaData = rutinaDoc.data();
            const nombreRutina = rutinaData.nombre;
            const descripcionRutina = rutinaData.descripcion;
            const repeticionesRutina = rutinaData.repeticion;
            const seriesRutina = rutinaData.serie;

            if (clienteRef) {
              const clienteDoc = await getDoc(clienteRef);
              if (clienteDoc.exists()) {
                const clienteData = clienteDoc.data();
                clienteData.nombre;
                // Crear un nuevo documento Word
                const docc = new Document({
                  sections: [
                    {
                      children: [
                        new Paragraph(`Datos del Cliente:`),
                        new Paragraph(`Nombre: ${clienteData.nombre}`),
                        new Paragraph(`Cedula: ${clienteData.cedula}`),
                        new Paragraph(`Correo: ${clienteData.correo}`),
                        new Paragraph(`Datos de la Rutina: `),
                        new Paragraph(`Nombre de la Rutina: ${nombreRutina}`),
                        new Paragraph(`Descripción: ${descripcionRutina}`),
                        new Paragraph(`Repeticiones: ${repeticionesRutina}`),
                        new Paragraph(`Series: ${seriesRutina}`),
                        new Paragraph(`Fecha de Inicio: ${startDate}`),
                        new Paragraph(`Fecha Final: ${endDate}`),
                        new Paragraph(`Objetivo: ${objetivo}`),
                        new Paragraph(`Peso: ${categoria}`),
                      ],
                    },
                  ],
                });

                // Generar un archivo Word
                const buffer = await Packer.toBuffer(docc);

                // Descargar el archivo Word
                const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${clienteData.nombre}_Historial.docx`;
                a.click();
                URL.revokeObjectURL(url);
              } else {
                console.log('El cliente no existe');
              }
            }
          }
        }
      }));

    } catch (error) {
      console.error('Error al generar el documento Word:', error);
    }
  };
  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    // Llamar a la función para generar el documento Word al presionar el botón
    await generateWordDocument();
  }

  const obtenerNombreRutina = async (idRutina: string) => {
    try {
      const rutinaDocRef = doc(db, 'rutina', idRutina);
      const rutinaDoc = await getDoc(rutinaDocRef);

      if (rutinaDoc.exists()) {
        const { nombre } = rutinaDoc.data(); // Suponiendo que el campo se llama 'nombre'
        if (nombre) {
          // Aquí tienes el nombre de la rutina asociada al cliente
          console.log('Nombre de la rutina asociada:', nombre);
          return nombre;
        } else {
          console.log('La rutina no tiene un nombre asociado.');
          return null; // O algún valor predeterminado si no hay nombre de rutina
        }
      } else {
        console.log('La rutina no existe.');
        return null; // O algún valor predeterminado si la rutina no existe
      }
    } catch (error) {
      console.error('Error al obtener el nombre de la rutina:', error);
      return null;
    }
  };

  return (
    <>
      <div className='container-calendario'>
        <div className='Conteiner-Cale'>
          <div>
            <h2 className='text-Cale'>{currentMonthName}</h2>
            <ArrowBackIosIcon onClick={handlePreviousMonth} />
            <ArrowForwardIosIcon onClick={handleNextMonth} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {renderDaysOfWeek()}
              {renderCalendar()}
            </div>
          </div>
          <button className="btnRoutine-Client" onClick={handleSaveDocument}>Guardar Información en Word</button>
        </div>

      </div>
      {isAssignRoutineModalOpen && (
        <div className="modal-addMember">
          <div className="content-addMember">
            <h2 className="personalInfo-title">Asignar rutina</h2>
            <form className="form-grid">
              <div className="form-row">
                <TextField
                  label="Titulo de Rutina"
                  type="text"
                  placeholder="Titulo"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                />
              </div>
              <div className="form-row">
                <TextField
                  label='Fecha Inicio'
                  type='date'
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="form-row">
                <TextField
                  label='Fecha Final'
                  type='date'
                  value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="form-row">
                <TextField
                  label="Objetivo"
                  type="text"
                  value={objectiveInput}
                  onChange={(e) => setObjectiveInput(e.target.value)}
                  placeholder="Objetivo"
                />
              </div>
              <div className="form-row">
                <TextField
                  label="Peso"
                  type="text"
                  value={category}
                  placeholder="Peso"
                  onChange={(e) => SetCategory(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label htmlFor="routineComboBox">Selecciona una rutina: </label>
                <select id="routineComboBox" onChange={handleRoutineChange} value={selectedRoutine}>
                  <option value="">Seleccionar...</option>
                  {routines.map((routine) => (
                    <option key={routine.id} value={routine.id}>
                      {routine.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="save-button" onClick={handleSaveObjective} >
                Guardar
              </button>
              <button className="Cancel-button" onClick={CloseAssignRoutine}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}