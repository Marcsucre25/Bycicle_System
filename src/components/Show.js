import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, authOther } from "../firebaseConfig/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { async } from "@firebase/util";
const MySwal = withReactContent(Swal);

const Show = () => {
  //1 - configuramos los hooks
  //const [products, setProducts] = useState( [] )
  const navigate = useNavigate();
  const [usuarios, setUsers] = useState([]);
  const [authUser, setAuthUser] = useState(null);


  //2 - referenciamos a la auth firestore
  const userCollection = collection(db, "usuarios");

  //3 - Funcion para mostrar TODOS los docs
  const getUsuarios = async () => {
    const data = await getDocs(userCollection);
    console.log(data.docs);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //console.log(products)
  };
  //4 - Funcion para eliminar un doc
  const handleDelete = async () => {
    try {
      await authOther.currentUser.delete();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = (id, email, password) => {
    const usersDoc = doc(db, "usuarios", id);
    deleteDoc(usersDoc);
    signInWithEmailAndPassword(authOther, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        handleDelete();
        getUsuarios();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //5 - Funcion de confirmacion para Sweet Alert 2
  const confirmDelete = (id, email, password) => {
    console.log(email);
    console.log(password);
    MySwal.fire({
      title: "¿Eliminar Usuario?",
      text: "Usted no podra revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Si, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        //llamamos a la funcion para eliminar
        deleteUser(id, email, password);
        Swal.fire("Eliminado!", "Usuario eliminado.", "success");
      }
    });
  };

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

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Cierre de sesion exitoso");
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  //6 - usamos useEffect
  useEffect(() => {
    getUsuarios();
    // eslint-disable-next-line
  }, []);

  //7 - devolvemos vista de nuestro componente
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-grid gap-2">
              <button className="btn btn-danger mt-2" onClick={userSignOut}>
                Cerrar Sesion
              </button>
              <Link to="/create" className="btn btn-secondary mt-2 mb-2">
                Crear Usuario
              </Link>
            </div>
            <table className="table table-striped align-middle mb-0 bg-white">
              <thead className="bg-info text-light">
                <tr>
                  <th>
                    {" "}
                    <h5>Correo</h5>{" "}
                  </th>
                  <th>
                    {" "}
                    <h5>Acciones</h5>
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.email}</td>
                    <td>
                      {/* <Link to={`/edit/${usuario.id}`} type="button" className="btn btn-info"><i className="fa-solid fa-pencil"></i></Link> */}
                      <button
                        type="button"
                        onClick={() => {
                          confirmDelete(
                            usuario.id,
                            usuario.email,
                            usuario.password
                          );
                        }}
                        className="btn btn-danger"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
