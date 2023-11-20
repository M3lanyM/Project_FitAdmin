import { CiEdit } from "react-icons/ci";
import React, { useState } from 'react';
import AdminLayout from './AdminLayout/AdminLayout';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuMail } from "react-icons/lu";
import { PiPhoneCall } from "react-icons/pi";
import { LiaFacebookSquare } from "react-icons/lia";
import { FiInstagram } from "react-icons/fi";
import { BiWorld } from "react-icons/bi";
import { FaSquareCaretLeft, FaSquareCaretRight } from "react-icons/fa6";

const IndexMudanca = () => {
  const [isEditarPerfil, setIsEditarPerfil] = useState(false);
  const [perfil, setPerfil] = useState({
    pais: 'Costa Rica',
    direccion: 'Río Claro, un costado de la Iglesia Príncipe de Paz',
    correo: 'mudancagymcr@gmail.com',
    telefono1: '8568 1749',
    telefono2: '6483 4521',
    facebook: 'https://www.facebook.com/MudancaGYM',
    instagram: 'https://www.instagram.com/mudancagym',
  });
  const [nuevoPerfil, setNuevoPerfil] = useState({ ...perfil });
  const [currentIMGIndex, setCurrentIMGIndex] = useState(0);
  const images = [
    "/img/p1.jpg",
    "/img/p2.jpg",
    "/img/p3.jpg",
    "/img/p4.jpg",
  ];

  const nextIMG = () => {
    setCurrentIMGIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevIMG = () => {
    setCurrentIMGIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const abrirModalEditar = () => {
    setIsEditarPerfil(true);
  };

  const cerrarModalEditar = () => {
    setIsEditarPerfil(false);
  };

  const guardarCambios = () => {
    setPerfil({ ...nuevoPerfil });
    cerrarModalEditar();
  };

  return (
    <>
      <AdminLayout>
        {isEditarPerfil ? (
          <div className="mod">
            <div className="modalPerfil">
              <label>Pais:</label>
              <input
                type="text"
                value={nuevoPerfil.pais}
                onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, pais: e.target.value })}
              />
              <label>Dirección:</label>
              <input
                type="text"
                value={nuevoPerfil.direccion}
                onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, direccion: e.target.value })}
              />
              <label>Correo:</label>
              <input
                type="text"
                value={nuevoPerfil.correo}
                onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, correo: e.target.value })}
              />
              <label>Teléfono 1:</label>
              <input
                type="text"
                value={nuevoPerfil.telefono1}
                onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, telefono1: e.target.value })}
              />
              <label>Teléfono 2:</label>
              <input
                type="text"
                value={nuevoPerfil.telefono2}
                onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, telefono2: e.target.value })}
              />
              <label>Link Facebook:</label>
              <input
                type="text"
                value={nuevoPerfil.facebook}
                onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, facebook: e.target.value })}
              />
              <label>Link Instagram:</label>
              <input
                type="text"
                value={nuevoPerfil.instagram}
                onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, instagram: e.target.value })}
              />
              <div className="btnPerfil">
                <button className="btnPerfil1" onClick={guardarCambios}>Guardar</button>
                <button className="btnPerfil2" onClick={cerrarModalEditar}>Cancelar</button>
              </div>
            </div>
          </div>
        ) : (
          <div className='hClient'>
            <div className='ContaMea'>
              <div className='mClient'>
                <img src="/img/perfil.png" alt="FitAdmin Logo" style={{ width: '80%' }} />
                <CiEdit style={{ fontSize: '1.9em', color: "#02afaf" }} onClick={abrirModalEditar} />
              </div>
              <div className='m'>
                <p className='icon-text'>
                  <BiWorld style={{ fontSize: '1.4em', color: "#888" }} />
                  <span className='titlePerfil'>Pais:</span>
                  <span className='texPerfil'>{perfil.pais}</span>
                </p>
                <p className='icon-text'>
                  <HiOutlineLocationMarker style={{ fontSize: '1.4em', color: "#888" }} />
                  <span className='titlePerfil'>Dirección:</span>
                  <span className='texPerfil'>{perfil.direccion}</span>
                </p>
                <p className='icon-text'>
                  <LuMail style={{ fontSize: '1.3em', color: "#888" }} />
                  <span className='titlePerfil'>Correo:</span>
                  <span className='texPerfil'>{perfil.correo}</span>
                </p>
                <p className='icon-text'>
                  <PiPhoneCall style={{ fontSize: '1.4em', color: "#888" }} />
                  <span className='titlePerfil'>Teléfono 1:</span>
                  <span className='texPerfil'>{perfil.telefono2}</span>
                </p>
                <p className='icon-text'>
                  <PiPhoneCall style={{ fontSize: '1.4em', color: "#888" }} />
                  <span className='titlePerfil'>Teléfono 2:</span>
                  <span className='texPerfil'>{perfil.telefono2}</span>
                </p>
                <p className='icon-text'>
                  <LiaFacebookSquare style={{ fontSize: '1.5em', color: "#888" }} />
                  <span className='titlePerfil'>Link Facebook:</span>
                  <a className='texPerfil' href={perfil.facebook}>{perfil.facebook}</a>
                </p>
                <p className='icon-text'>
                  <FiInstagram style={{ fontSize: '1.3em', color: "#888" }} />
                  <span className='titlePerfil'>Link Instagram:</span>
                  <a className='texPerfil' href={perfil.instagram}>{perfil.instagram}</a>
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="IMGCarousel">
          <button className="arrow-icons" onClick={prevIMG}>
            <FaSquareCaretLeft style={{ fontSize: '1.7em', color: "#02afaf", marginRight: '5px' }} />
          </button>
          {images.length > 0 && (
            <img
              className="IMGSub"
              src={images[currentIMGIndex]}
              alt={`Imagen ${currentIMGIndex + 1}`}
              width={450}
              height={466}
            />
          )}
          <button className="arrow-icons" onClick={nextIMG}>
            <FaSquareCaretRight style={{ fontSize: '1.7em', color: "#02afaf", marginLeft: '5px' }} />
          </button>
        </div>
      </AdminLayout>
    </>
  );
};

export default IndexMudanca;


