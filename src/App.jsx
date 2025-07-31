import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { CalendarDays, Scale, MessageSquare, BookOpen, Heart, User } from 'lucide-react'; // Importa iconos de Lucide React

// Importa tus componentes
import PregnancyTracker from './components/PregnancyTracker';
import LoadingScreen from './components/LoadingScreen';
import NavigationButton from './components/NavigationButton'; // ¡NUEVO! Importa el componente de botón de navegación

  const firebaseConfig = {
    apiKey: "AIzaSyBy20Kt8wMFqochvbRZA1FtstiysZCeoqw",
    authDomain: "pregnancytrackerapp-11ca6.firebaseapp.com",
    projectId: "pregnancytrackerapp-11ca6",
    storageBucket: "pregnancytrackerapp-11ca6.firebasestorage.app",
    messagingSenderId: "647630428541",
    appId: "1:647630428541:web:b6cd48953f14f7cbca9414",
    measurementId: "G-1ERGFD8CL5"
  };

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Inicializa Firebase fuera del componente para evitar re-inicializaciones
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario
  const [loadingAuth, setLoadingAuth] = useState(true); // Estado para saber si la autenticación está cargando



  //Para manejar la autenticacion de firebase
  useEffect(() => {
    // Concepto: onAuthStateChanged
    // Esta función es un listener que se activa cada vez que el estado de autenticación del usuario cambia
    // (ej. el usuario inicia sesión, cierra sesión, o se autentica por primera vez).
    // Es el lugar ideal para obtener el ID del usuario y saber si está autenticado.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuario autenticado
        setUserId(user.uid);
        console.log("Usuario autenticado:", user.uid);
      } else {
        // No hay usuario, intentar autenticación anónima
        console.log("No hay usuario autenticado, intentando autenticación anónima...");
        try {
          if (initialAuthToken) {
            // Si hay un token inicial de Canvas, úsalo
            await signInWithCustomToken(auth, initialAuthToken);
            console.log("Autenticación con token personalizado exitosa.");
          } else {
            // Si no, autenticación anónima normal
            await signInAnonymously(auth);
            console.log("Autenticación anónima exitosa.");
          }
        } catch (error) {
          console.error("Error en la autenticación anónima o con token:", error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      }
      setLoadingAuth(false); // La carga de autenticación ha terminado
    });

    // Concepto: Cleanup function en useEffect
    // La función que devuelve useEffect se ejecuta cuando el componente se desmonta.
    // Esto es crucial para "limpiar" listeners o timers y evitar fugas de memoria.
    return () => unsubscribe();
  }, []); // El array vacío [] significa que este efecto se ejecuta solo una vez al montar el componente.

  // Concepto: Renderizado Condicional
  // React te permite renderizar diferentes elementos o componentes basados en condiciones.
  // Aquí, si `loadingAuth` es true, mostramos el componente `LoadingScreen`.
  // Si es false, mostramos el contenido principal de la aplicación.
  if (loadingAuth) {
    return <LoadingScreen />; // Usamos el nuevo componente de pantalla de carga
  }

  // Función de ejemplo para manejar el clic en un botón de navegación
  const handleNavClick = (sectionName) => {
    console.log(`Navegando a la sección: ${sectionName}`);
    // Aquí, en futuros sprints, actualizaremos un estado para cambiar la sección visible
  };

  // Concepto: JSX (JavaScript XML)
  // JSX es una extensión de sintaxis para JavaScript que te permite escribir código
  // similar a HTML dentro de tus archivos JavaScript. React lo usa para describir
  // cómo debería verse la interfaz de usuario.
  // Las clases CSS se definen con `className` en lugar de `class`.
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-pink-600 text-white font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-4xl text-center py-6">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Momento Mágico 🤰✨
        </h1>
        <p className="text-xl mt-2 text-purple-200">Tu guía personal en el embarazo</p>
      </header>

      <main className="flex-grow w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-8">
        {/* Aquí irán las diferentes secciones de la aplicación */}
        <nav className="flex justify-around items-center bg-white bg-opacity-20 rounded-full p-2 shadow-inner">
          {/* Usamos el nuevo componente NavigationButton para cada botón */}
          <NavigationButton icon={CalendarDays} text="Mi Embarazo" onClick={() => handleNavClick('Mi Embarazo')} />
          <NavigationButton icon={MessageSquare} text="Foros" onClick={() => handleNavClick('Foros')} />
          <NavigationButton icon={BookOpen} text="Recetas" onClick={() => handleNavClick('Recetas')} />
          <NavigationButton icon={Heart} text="Apoyo" onClick={() => handleNavClick('Apoyo')} />
        </nav>

        {/* Renderiza el componente PregnancyTracker si el usuario está autenticado */}
        {userId ? (
          <PregnancyTracker userId={userId} db={db} appId={appId}/>
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
  );
}

export default App;