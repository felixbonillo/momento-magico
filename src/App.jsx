import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import {
  CalendarDays,
  Scale,
  MessageSquare,
  BookOpen,
  Heart,
  User,
} from "lucide-react"; //Importacion de codigos de Lucide React

//Importar nuevo componente PregnancyTracker
import PregnancyTracker from "./PregnancyTracker";

const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

//Inicializa Firebase fuera del componente para evitar re-inicializaciones
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [userId, setUserId] = useState(null); //Estado para almacenar el ID del usuario
  const [loadingAuth, setLoadingAuth] = useState(true); //Estado para saber si la autenticacion esta cargando

  useEffect(() => {
    //Es un listener que se activa cada vez que el estado de la autenticacion del usuario cambia
    //Ej Inicia sesion, cierra sesion o autentica por primera vez
    //Es el lugar ideal para obtener el id del usuario y saber si esta autenticado

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        //Usuario autenticado
        setUserId(user.uid);
        console.log("Usuario autenticado: ", user.uid)
      } else {
        //No hay usuario, intentar autenticacion anonima
        console.log("No hay usuario autenticado, intentando autenticacion anonima... ")
        try {
          if (initialAuthToken) {
            //Si hay token inicial de canvas, usalo
            await signInWithCustomToken(auth, initialAuthToken)
            console.log("Autenticacion con token personalizado exitosa")
          } else {
            //Si no, autenticacion anonima normal
            await signInAnonymously(auth);
            console.log("Autenticacion anonima exitosa")
          }
        } catch (error) {
          console.error("Error en la autenticacion anonima o con token: ", error);
        }
      }
      setLoadingAuth(false); //La carga de autenticacion ha terminado
    });



    //Concepto: Cleanup funcion en useEffect
    //La funcion que devuelve useEffect se ejecuta cuadno el componente se desmonta
    //Esto es crucial para "limpiar" listeners o timers y evitar fugas de memoria
    return () => unsubscribe();
  }, []); /*El array vacio [] significa que este efecto se ejecuta solo una vez al montar el componente*/

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl">Cargando Momento Magico... </p>
      </div>)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-pink-600 text-white font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-4xl text-center p">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Momento Mágico 🤰✨
        </h1>
        <p className="text-xl mt-2 text-purple-200">
          Tu guia personal en el embarazo
        </p>
      </header>

      <main className="flex-grow w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-8">
        {/*Aqui iran las secciones de la aplicacion*/}
        <nav className="flex-grow w-full max-w-4xl bg-white bg-opacity-20 rounded-full transition-all duration-200">
          <button className="flex flex-col items-center p-2 text-sm text-sm text-white hover:bg-white hover:bg-opacity-30 rounded-full transition-all duration-200">
            <CalendarDays size={24} />
            <span className="mt-1 hidden md:block">Mi embarazo</span>
          </button>
        </nav>
        {/* Renderiza el componente PregnancyTracker si el usuario está autenticado */}
        {userId ? (
          <PregnancyTracker userId={userId} db={db} />
        ) : (
          <div className="text-center text-lg text-red-300">
            No se pudo autenticar al usuario. Por favor, recarga la página.
          </div>
        )}
      </main>
      <footer className="w-full max-w-4xl text-center py-4 mt-8 text-purple-200 text-sm">
        <p>&copy; 2024 Momento Mágico. Desarrollado con ❤️ por Félix Bonillo.</p>
      </footer>
    </div>
  )
  //Siempre pensar en ser declarativo y no imperativo
  //Queremos describir como debe verse la interfaz, no como construirla paso a paso
}

export default App;