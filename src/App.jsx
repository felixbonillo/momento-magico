import React, {useState, useEffect} from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { CalendarDays, Scale, MessageSquare, BookOpen, Heart, User } from "lucide-react"; //Importacion de codigos de Lucide React

//Importar nuevo componente PregnancyTracker
import PregnancyTracker from './PregnancyTracker';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null

//Inicializa Firebase fuera del componente para evitar re-inicializaciones
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)