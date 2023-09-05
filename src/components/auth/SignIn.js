import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig/firebase";
import { useNavigate } from 'react-router-dom';


const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        console.log(userCredential);
        navigate('show');
        })
        .catch((error) => {
        console.log(error);
        });
    };

    return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
        <form className="logInForm border border-dark rounded p-4" onSubmit={signIn}>
        <h1>Inicio de sesion</h1>
        <div className='mb-3'>
            <label className='form-label'>Correo</label>
            <input className='form-control'
                type="email"
                placeholder="example@hotmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            ></input>
        </div>
        <div className='mb-3'>
            <label className='form-label'>Contraseña</label>
            <input className='form-control'
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            ></input>
        </div>
        <button className="btn btn-primary" type="submit">Iniciar Sesion</button>
        </form>
    </div>
    );
    };

export default SignIn;