import React, { useState } from 'react';

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

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    // Aquí puedes enviar las medidas al servidor o hacer lo que necesites con ellas
    // Por ahora, simplemente cerraremos el modal
    handleClose();
  };

  return (
    <>
      <div>
        <button className='btnClient' onClick={handleOpen}>
          + Agregar medidas
        </button>
        <h2>Contenido de la Vista Uno</h2>
        <p>Este es el contenido que se mostrará en la pestaña de MEDIDAS</p>
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
            <div className="modal-buttons">
              <button onClick={handleSave}>Guardar</button>
              <button onClick={handleClose}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
