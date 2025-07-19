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
        try{
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
    });
  }, []);
}
