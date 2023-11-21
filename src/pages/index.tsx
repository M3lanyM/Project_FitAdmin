import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import React from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from "../firebase/config";
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import router from 'next/router';
import { restPassword } from "../firebase/config";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import LockResetIcon from '@mui/icons-material/LockReset';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [showLogin, setShowLogin] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordReset, setPasswordReset] = useState(false);
  const [showEmptyFieldModal, setShowEmptyFieldModal] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  }
  const openPasswordReset = () => {
    setPasswordReset(true);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const Registration = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (correo.trim() === "" || contrasena.trim() === "" || nombre.trim() === "" || apellido.trim() === "") {
        setShowEmptyFieldModal(true);
        return;
      }
      const querySnapshot = await getDocs(query(collection(db, 'usuario'), where('correo', '==', correo)));
      if (!querySnapshot.empty) {
        // El correo ya está registrado
        setShowEmailModal(true);
        return;
      }
      const registrousario = {
        correo,
        contrasena,
        nombre,
        apellido,
      };

      await createUserWithEmailAndPassword(auth, correo, contrasena);
      await addDoc(collection(db, "usuario"), registrousario);
      // Limpiar los campos después del registro exitoso
      setCorreo("");
      setContrasena("");
      setNombre("");
      setApellido("");

      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (correo.trim() === "" || contrasena.trim() === "") {
        setShowEmptyFieldModal(true);
        return;
      }

      // Autenticar al usuario con Firebase usando correo y contraseña
      await signInWithEmailAndPassword(auth, correo, contrasena);

      // Obtener el usuario actual después de la autenticación
      const user = auth.currentUser;

      if (user) {
        // El usuario está autenticado
        // Ahora puedes realizar acciones adicionales si es necesario
        // Por ejemplo, redirigir al usuario a otra página
        router.push("/indexMudanca");
      } else {
        // El usuario no está autenticado correctamente
        // Puedes mostrar un mensaje de error o realizar otras acciones aquí
        setShowErrorModal(true); // Mostrar el modal de error

      }
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
    }
  };

  //Método olvido su contraseña
  const handlePasswordReset = async () => {
    if (!correo) {
      alert("Por favor ingrese un correo valido.");
      return;
    }
    // Validar el formato del correo electrónico
    const emailRegex = /^\S+@\S+\.\S+$/; // Expresión regular para validar el correo electrónico
    if (!emailRegex.test(correo)) {
      alert("El formato del correo electrónico no es válido");
      return;
    }
    try {
      await restPassword(correo);
      alert("Se envió un correo para restablecer tu contraseña. Por favor, verifica tu bandeja de entrada.");
      setPasswordReset(false);

    } catch (error) {
      console.error("Error al enviar el correo de restablecimiento de contraseña", error);
      alert("Error al enviar el correo de restablecimiento de contraseña" + error);
    }
  };

  return (
    <>
      <div className="bodyLogin">
        <div className="main">
          <input type="checkbox" id="chk" aria-hidden="true" />
          <div className={`signup ${showLogin ? 'hide' : ''}`}>
            <form>
              <label className="labelLogin" htmlFor="chk" aria-hidden="true">Iniciar Sesión</label>

              <div className='prueba'>
                <FormControl className="usernameForm"
                  variant="standard">
                  <InputLabel htmlFor="username" style={{ color: 'white' }}>
                    Correo
                  </InputLabel>
                  <Input
                    onChange={(e) => setCorreo(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <AccountCircle className="iconForm1" />
                      </InputAdornment>
                    }
                    classes={{ underline: 'inputUnderline' }}
                    inputProps={{ style: { color: 'white' } }}
                    className="customInput1" />
                </FormControl>
              </div>

              <div className='prueba1'>
                <FormControl className='passwordForm' sx={{
                  width: '21.4ch',
                }} variant="standard">
                  <InputLabel htmlFor="password" style={{ color: 'white' }}>
                    Contraseña
                  </InputLabel>
                  <Input
                    onChange={(e) => setContrasena(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <VisibilityOff className="iconForm" /> : <Visibility className="iconForm" />}
                        </IconButton>
                      </InputAdornment>
                    }
                    classes={{ underline: 'inputUnderline' }} // Asigna la clase personalizada al borde inferior
                    inputProps={{ style: { color: 'white' } }} // Cambia el color del texto dentro del Input
                    className="customInput1" />
                </FormControl>
              </div>
              <div className='margin-pass'>
                <a className="forgot-pass" href="#" onClick={openPasswordReset}>
                  Olvidé la contraseña
                </a>
              </div>
              <button className="btnSign" onClick={handleLogin}>
                Iniciar
              </button>

            </form>
          </div>
          <div className={`login ${showLogin ? '' : 'hide'}`}>
            <form>
              <label className="labelLogin" htmlFor="chk" aria-hidden="true">Registrarse</label>

              <input
                className="inpLogin"
                type="name"
                name="name"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required />
              <input
                className="inpLogin"
                type="lastmane"
                name="lastmane"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required />
              <input
                className="inpLogin"
                type="email"
                name="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)} required />

              <Tooltip title="Contraseña (mínimo 6 caracteres)" arrow placement="top">
                <div className="password">
                  <input
                    className="password-user"
                    type={showPassword ? "text" : "password"}
                    name="passwordUser"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="user-view  password-toggle-button"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </Tooltip>

              <button className="btnLogin" onClick={Registration}>Registrar</button>

            </form>
          </div>
          {showSuccessModal && (
            <div className="modalLogin">
              <div className="modal-contentLogin">
                <span className="closeLogin" onClick={() => setShowSuccessModal(false)}>&times;</span>
                <p className='text-modalLogin'>¡Registro exitoso!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showEmptyFieldModal && (
        <div className="modalLogin">
          <div className="modal-contentLogin">
            <span className="closeLogin" onClick={() => setShowEmptyFieldModal(false)}>
              &times;
            </span>
            <p className='text-modalLogin'>Por favor, ingresa todos los datos.</p>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="modalLogin">
          <div className="modal-contentLogin">
            <span className="closeLogin" onClick={() => setShowErrorModal(false)}>
              &times;
            </span>
            <p className='text-modalLogin'>Correo/Contraseña incorrectos.<br />
              Inténtalo de nuevo.
            </p>
          </div>
        </div>
      )}
      {showEmailModal && (
        <div className="modalLogin">
          <div className="modal-contentLogin">
            <span className="closeLogin" onClick={() => setShowEmailModal(false)}>
              &times;
            </span>
            <p className='text-modalLogin'>Este correo electrónico ya está registrado.<br />
              Por favor, intenta utilizando otro correo.
            </p>
          </div>
        </div>
      )}
      {showPasswordReset && (
        <div className="modalLogin">
          <div className="modal-contentLogin">
            <span className="closeLogin" onClick={() => setPasswordReset(false)}>
              &times;
            </span>
            <LockResetIcon className='Password-icon' />
            <h1 className="texPassword">Recuperar contraseña</h1>
            <div className="icons-PasswordReset">
              <MarkEmailReadIcon className='PasswordReset-icon' />
              <input
                className="user-name"
                type="text"
                name="correo"
                placeholder="Ingrese su correo"
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <button onClick={handlePasswordReset} className="BtnPasswordReset">
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

