import React from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

/*
  Concept: PregnancyTracker Component
  Este componente es el núcleo del seguimiento del embarazo. Ahora permite al usuario ingresar su
  fecha de último período (FUP), calcula la fecha probable de parto (FPP) y la semana actual de embarazo,
  y guarda estos datos en Firestore. También muestra la información calculada.
*/