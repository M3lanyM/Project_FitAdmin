import { Inter } from 'next/font/google'
import Link from 'next/link';
import { useState, useEffect } from 'react'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import React from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from "../firebase/config";
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import router from 'next/router';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para el modal

  const handleToggle = () => {
    setShowLogin(!showLogin);
  }
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const Registration = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
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
        // Mostrar un mensaje de error o hacer lo que necesites cuando falta el correo o la contraseña.
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
      }
    } catch (error) {
      console.error(error);
      // Manejar errores, por ejemplo, mostrar un mensaje de error
      //setErrorMessage("Correo/Contraseña incorrectos.");
      //setIsModalOpenError(true);
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
              
              <div className='formControlContainer'>
                <FormControl variant="standard">
                  <InputLabel htmlFor="input-with-icon-adornment">
                    Digite su correo
                  </InputLabel>
                  <Input
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle className="icon" />
                      </InputAdornment>
                    }
                  />
                </FormControl>

              </div>
              <div className="icons">
                <input
                  className="user-name"
                  type="email"
                  name="email"
                  placeholder="Correo"
                  onChange={(e) => setCorreo(e.target.value)} required
                />
                <AccountCircle className='user-icon' />
              </div>
<div className='prueba'>
              <FormControl className="usernameForm" sx={{
                m: 1, width: '23ch',
                '& label.Mui-focused': { color: 'white' }
              }} variant="standard">
                <InputLabel htmlFor="username" className="customInputLabel">
                  Correo
                </InputLabel>
                <Input
                  onChange={(e) => setCorreo(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <AccountCircle className="iconForm" />
                    </InputAdornment>
                  }
                  className="customInput"
                />
              </FormControl>
</div>
              <FormControl className='passwordForm' sx={{
                m: 1, width: '23ch',
                '& label.Mui-focused': { color: 'white' }
              }} variant="standard">
                <InputLabel htmlFor="password" className="customInputLabel">
                  Contraseña
                </InputLabel>
                <Input className="customInput"
                  onChange={(e) => setContrasena(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton className="iconForm"
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

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
                type="email"
                name="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)} required />

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
              <button className="btnLogin" onClick={Registration}>Registrar</button>

            </form>
          </div>
          {showSuccessModal && (
            <div className="modal-successful">
              <div className="custom-modal-successful">
                <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
                <p className='text-delete'>¡Registro exitoso!</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </>

  )
}

