import Link from 'next/link';
import { useState, useEffect } from 'react'

const LoginPage: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);

    const handleToggle = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="main">


            <input type="checkbox" id="chk" aria-hidden="true" />
            <div className={`signup ${showLogin ? 'hide' : ''}`}>
                <form>
                    <label className= "labelLogin" htmlFor="chk" aria-hidden="true">Iniciar Sesión</label>
                    <input className="inpSign" type="email" name="email" placeholder="Usuario" required />
                    <input className="inpSign" type="password" name="pswd" placeholder="Contraseña" required />

                    <Link href="./indexMudanca">
                        <button className="btnSign" >Iniciar</button>
                    </Link>

                </form>
            </div>
            <div className={`login ${showLogin ? '' : 'hide'}`}>
                <form>
                    <label className= "labelLogin" htmlFor="chk" aria-hidden="true">Registrarse</label>
                    <input className="inpLogin" type="text" name="txt" placeholder="Usuario" required />
                    <input className="inpLogin" type="email" name="email" placeholder="Correo" required />
                    <input className="inpLogin" type="password" name="pswd" placeholder="Contraseña" required />
                    <button className="btnLogin" onClick={handleToggle}>Registrar</button>
                </form>

            </div>
        </div>
    );

};


export default LoginPage;