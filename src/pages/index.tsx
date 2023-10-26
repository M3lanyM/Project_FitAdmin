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

const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  }
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <>
      <div className="bodyLogin">
        <div className="main">


          <input type="checkbox" id="chk" aria-hidden="true" />
          <div className={`signup ${showLogin ? 'hide' : ''}`}>
            <form>
              <label className="labelLogin" htmlFor="chk" aria-hidden="true">Iniciar Sesión</label>

              <FormControl className="usernameForm" sx={{
                m: 1, width: '23ch',
                '& label.Mui-focused': { color: 'white' }
              }} variant="standard">
                <InputLabel htmlFor="username" className="customInputLabel">
                  Usuario
                </InputLabel>
                <Input
                  endAdornment={
                    <InputAdornment position="end">
                      <AccountCircle className="iconForm" />
                    </InputAdornment>
                  }
                  className="customInput"
                />
              </FormControl>

              <FormControl className='passwordForm' sx={{
                m: 1, width: '23ch',
                '& label.Mui-focused': { color: 'white' }
              }} variant="standard">
                <InputLabel htmlFor="password" className="customInputLabel">
                  Contraseña
                </InputLabel>
                <Input className="customInput"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton className="iconForm"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>


              <Link href="./indexMudanca">
                <button className="btnSign" >Iniciar</button>
              </Link>

            </form>
          </div>
          <div className={`login ${showLogin ? '' : 'hide'}`}>
            <form>

              <label className="labelLogin" htmlFor="chk" aria-hidden="true">Registrarse</label>            
              <input className="inpLogin" type="text" name="txt" placeholder="Usuario" required />
              <input className="inpLogin" type="email" name="email" placeholder="Correo" required />
              <input className="inpLogin" type="password" name="pswd" placeholder="Contraseña" required />
              <button className="btnLogin" onClick={handleToggle}>Registrar</button>
            </form>
          </div>
        </div>
      </div>

    </>

  )
}

