import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  where
} from "firebase/firestore";
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
    status: "Habilitado",
    gender: "Femenino",
    admDate: "",
    nextPay: "",
    precio: "",
    membership: "",
  });

  const [membershipPrices, setMembershipPrices] = useState<{ [key: string]: number }>({});
  const [membershipOptions, setMembershipOptions] = useState<string[]>(["Seleccione una opción"]);

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
        telefono: formData.phone,
        estado: formData.status,
        sexo: formData.gender,
      });

      console.log("Documento escrito con ID: ", docRef.id);

    // Consulta Firestore para obtener la referencia al documento de membresía seleccionado
    let membershipRef = null;
    const membershipCollection = collection(db, "membresia");
    const membershipQuery = query(
      membershipCollection,
      where("tipo", "==", formData.membership) // Consulta la membresía con el nombre seleccionado
    );
    const membershipSnapshot = await getDocs(membershipQuery);

    if (!membershipSnapshot.empty) {
      membershipSnapshot.forEach((doc) => {
        membershipRef = doc.ref; // Obtén la referencia al documento de membresía
      });
    } else {
      console.error("No se encontró la membresía seleccionada.");
      return;
    }

    // Agrega los datos a la colección "clienteMembresia" con la referencia a la membresía
    await addDoc(collection(db, "clienteMembresia"), {
      clienteId: doc(db, "cliente", docRef.id),
      membershipId: membershipRef, // Usar la referencia al documento de membresía
      fechaIngreso: formData.admDate,
      proximoPago: formData.nextPay,
    });

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

  useEffect(() => {
    //trae los datos de la membrecia y el precio de esa membresia
    const fetchMembershipTypes = async () => {
      const membershipCollection = collection(db, "membresia");
      const membershipQuery = query(membershipCollection);
      const membershipSnapshot = await getDocs(membershipQuery);

      const membershipTypes: { [key: string]: number } = {};
      membershipSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.tipo && data.precio) {
          membershipTypes[data.tipo] = data.precio;
        }
      });

      setMembershipOptions(["Seleccione una opción", ...Object.keys(membershipTypes)]);
      setMembershipPrices(membershipTypes);
    };

    fetchMembershipTypes();

    // Establece "Seleccione una opción" como el valor inicial en "membership"
    setFormData((prevData) => ({
      ...prevData,
      membership: "Seleccione una opción",
    }));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "membership" && value === "Seleccione una opción") {
      // Si se selecciona "Seleccione una opción", establece el valor en blanco.
      setFormData((prevData) => ({
        ...prevData,
        [name]: "",
        precio: "",
      }));
    } else if (name === "membership") {
      // Si el campo seleccionado no es "Seleccione una opción", actualiza el campo "precio"
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        precio: membershipPrices[value] ? membershipPrices[value].toString() : "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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
          <label htmlFor="Fecha de Nacimiento" className="date-bornClient">
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
          <label htmlFor="Correo" className="correoClient">
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
        <label htmlFor="Teléfono" className="telephonoClient">
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
          <label htmlFor="Estado" className="date-bornClient">
            Estado:
          </label>
          <select
            className="statusform"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Habilitado">Habilitado</option>
            <option value="Deshabilitado">Deshabilitado</option>
          </select>

          <label htmlFor="Sexo" className="correoClient">
            Sexo:
          </label>
          <select
            className="genderform"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
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
            Tipo de membresía:
          </label>
          <select
            className="inputformC1"
            name="membership"
            value={formData.membership}
            onChange={handleInputChange}
          >
            {membershipOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
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
