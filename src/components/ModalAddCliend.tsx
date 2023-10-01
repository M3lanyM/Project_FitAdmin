import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface ModalAddClientProps {
  onClose: () => void;
}

const ModalAddClient: React.FC<ModalAddClientProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    secondLastName: "",
    cedula: "",
    birthDate: "",
    email: "",
    phone: "",
    status: "",
    gender: "",
    admDate: "",
    nextPay: "",
    precio: "",
    membership: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddClient = async () => {
    try {
      // Agrega los datos del formulario a la colección "cliente" en Firestore
      const docRef = await addDoc(collection(db, "cliente"), {
        nombre: formData.firstName,
        primerApellido: formData.lastName,
        segundoApellido: formData.secondLastName,
        cedula: formData.cedula,
        fechaNacimiento: formData.birthDate,
        correo: formData.email,
        thelefono: formData.phone,
        estado: formData.status,
        sexo: formData.gender,
      });

      console.log("Documento escrito con ID: ", docRef.id);

      // Limpia el formulario después de la presentación exitosa
      setFormData({
        firstName: "",
        lastName: "",
        secondLastName: "",
        cedula: "",
        birthDate: "",
        email: "",
        phone: "",
        status: "",
        gender: "",
        admDate: "",
        nextPay: "",
        precio: "",
        membership: "",
      });

      // Cierra el modal o realiza cualquier otra acción necesaria 
      onClose();
      
    } catch (error) {
      console.error("Error al agregar el documento: ", error);
    }
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <label className="custom-label">DATOS PERSONALES</label>
        <div className="formRow1">
          <label htmlFor="Nombre" className="nameClient">
            Nombre:
          </label>
          <input
            className="inputformC"
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <label htmlFor="primerApellido" className="lastnameClient">
            Primer apellido:
          </label>
          <input
            className="inputformC"
            type="text"
            name="lastName"
            placeholder="Primer Apellido"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <label htmlFor="segundoApellido" className="secondnameClient">
            Segundo apellido:
          </label>
          <input
            className="inputformC"
            type="text"
            name="secondLastName"
            placeholder="Segundo Apellido"
            value={formData.secondLastName}
            onChange={handleInputChange}
          />
        </div>
        <label htmlFor="cedula" className="cedulaClient">
          Cedula:
        </label>
        <div className="formRow2">
          <input
            className="inputformC"
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={formData.cedula}
            onChange={handleInputChange}
          />
          <label htmlFor="Nombre" className="date-bornClient">
            Fecha de Nacimiento:
          </label>
          <input
            className="dateform"
            type="date"
            name="birthDate"
            placeholder="Fecha de Nacimiento"
            value={formData.birthDate}
            onChange={handleInputChange}
          />
          <label htmlFor="Nombre" className="correoClient">
            Correo:
          </label>
          <input
            className="inputformC"
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <label htmlFor="Nombre" className="telephonoClient">
          Teléfono:
        </label>
        <div className="formRow3">
          <input
            className="inputformC"
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <label htmlFor="Nombre" className="date-bornClient">
            Estado:
          </label>
          <select
            className="statusform"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="habilitado">Habilitado</option>
            <option value="deshabilitado">Deshabilitado</option>
          </select>
          <label htmlFor="Nombre" className="correoClient">
            Sexo:
          </label>
          <select
            className="genderform"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <label className="custom-label1">DETALLES DE PAGO</label>
        <div className="formRow4">
          <label htmlFor="Fecha de Ingreso" className="date-admClient">
            Fecha de Ingreso
          </label>
          <input
            className="admDate"
            type="date"
            name="admDate"
            placeholder="Fecha de Ingreso"
            value={formData.admDate}
            onChange={handleInputChange}
          />
          <label htmlFor="Próximo Pago" className="next-payClient">
            Próximo Pago
          </label>
          <input
            className="nextPay"
            type="date"
            name="nextPay"
            placeholder="Próximo Pago"
            value={formData.nextPay}
            onChange={handleInputChange}
          />

          <label htmlFor="membership" className="membershipClient">
            Tipo de membresia:
          </label>
          <select
            className="inputformC1"
            name="membership"
            value={formData.membership}
            onChange={handleInputChange}
          >
            <option value="habilitado">Estudiante</option>
            <option value="deshabilitado">Personalizado</option>
          </select>

          <label htmlFor="Precio" className="precioClient">
            Precio
          </label>
          <input
            className="inputformC1"
            type="number"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleInputChange}
          />
        </div>

        <div className="addMclient">
        <button className="addButton" onClick={handleAddClient}>
            + Agregar
          </button>
          <button className="closeButton" onClick={onClose}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddClient;
