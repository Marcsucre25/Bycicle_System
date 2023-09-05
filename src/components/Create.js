import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc} from "firebase/firestore";
import { auth, db } from "../firebaseConfig/firebase";

const Create = () => {
  const [email, setEmail] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const navigate = useNavigate();

  //funcion para obtener la ubicacion
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          window.alert("Error al obtener la ubicación:", error);
        }
      );
    } else {
      window.alert("La geolocalización no está disponible en este navegador.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const productsCollection = collection(db, "usuarios");

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userUID = userCredential.user.uid;

        // Crea un nuevo documento en Firestore con el mismo UID como ID
        const userDocRef = doc(productsCollection, userUID);
        setDoc(userDocRef, {
          email: email,
          password: password,
          name: name,
          latitude: latitude,
          longitude: longitude,
        })
          .then(() => {
            navigate("/show");
          })
          .catch((error) => {
            console.log("Error al guardar el documento en Firestore:", error);
          });
      })
      .catch((error) => {
        console.log("Error al crear el usuario:", error);
      });
  };

  /* const store = async (e) => {
        e.preventDefault()
        await addDoc( productsCollection, { email: email} )
        navigate('/')
        //console.log(e.target[0].value)
    } */

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row border border-dark rounded p-4">
        <div className="col">
          <h1>Crear Usuario</h1>
          <form onSubmit={signUp}>
            <div className="mb-3">
              <label className="form-label">Nombre:</label>
              <input
                placeholder="Tu nombre..."
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input
                value={email}
                placeholder="Ingresa el correo"
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                value={password}
                placeholder="Ingresa la contraseña"
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
