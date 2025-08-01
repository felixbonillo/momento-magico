import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { CalendarDays, MessageSquare, BookOpen, Heart } from 'lucide-react'; // Importa iconos de Lucide React

// Importa tus componentes
import PregnancyTracker from './components/PregnancyTracker';
import LoadingScreen from './components/LoadingScreen';
import NavigationButton from './components/NavigationButton'; // ¡NUEVO! Importa el componente de botón de navegación
import WelcomeScreen from './components/WelcomeScreen'; // Importa la pantalla de bienvenida

// Configuración de Firebase (asegúrate de que esta configuración es correcta para tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyBy20Kt8wMFqochvbRZA1FtstiysZCeoqw",
  authDomain: "pregnancytrackerapp-11ca6.firebaseapp.com",
  projectId: "pregnancytrackerapp-11ca6",
  storageBucket: "pregnancytrackerapp-11ca6.firebasestorage.app",
  messagingSenderId: "647630428541",
  appId: "1:647630428541:web:b6cd48953f14f7cbca9414",
  measurementId: "G-1ERGFD8CL5"
};

// Accede a la variable global __initial_auth_token si está disponible
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
// Accede a la variable global __app_id
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Inicializa Firebase fuera del componente para evitar re-inicializaciones
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario
  const [loadingAuth, setLoadingAuth] = useState(true); // Estado para saber si la autenticación está cargando
  const [activeSection, setActiveSection] = useState('Mi Embarazo'); // Estado para la sección activa
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true); // Estado para mostrar la pantalla de bienvenida

  // Para manejar la autenticación de firebase
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error durante la autenticación de Firebase:", error);
      } finally {
        setLoadingAuth(false); // La carga de autenticación ha terminado
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("Usuario autenticado:", user.uid);
      } else {
        setUserId(null);
        console.log("No hay usuario autenticado.");
      }
    });

    authenticateUser(); // Llama a la función de autenticación

    return () => unsubscribe();
  }, []); // Dependencias: auth y initialAuthToken

  // Función de ejemplo para manejar el clic en un botón de navegación
  const handleNavClick = (sectionName) => {
    console.log(`Navegando a la sección: ${sectionName}`);
    setActiveSection(sectionName); // Actualiza la sección activa
  };

  // Función para manejar el inicio de la aplicación desde la pantalla de bienvenida
  const handleStartApp = () => {
    setShowWelcomeScreen(false); // Oculta la pantalla de bienvenida
  };

  // Renderizado Condicional: Muestra la pantalla de carga si la autenticación está en progreso
  if (loadingAuth) {
    return <LoadingScreen />;
  }

  // Renderizado Condicional: Muestra la pantalla de bienvenida si showWelcomeScreen es true
  if (showWelcomeScreen) {
    return <WelcomeScreen onStart={handleStartApp} />;
  }

  // Si no está cargando y la pantalla de bienvenida ya se ocultó, muestra la aplicación principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-pink-600 text-white font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-4xl text-center py-6">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Momento Mágico 🤰✨
        </h1>
        <p className="text-xl mt-2 text-purple-200">Tu guía personal en el embarazo</p>
      </header>

      <main className="flex-grow w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-8">
        <nav className="flex justify-around items-center bg-white bg-opacity-20 rounded-full p-2 shadow-inner">
          <NavigationButton icon={CalendarDays} text="Mi Embarazo" onClick={() => handleNavClick('Mi Embarazo')} />
          <NavigationButton icon={MessageSquare} text="Foros" onClick={() => handleNavClick('Foros')} />
          <NavigationButton icon={BookOpen} text="Recetas" onClick={() => handleNavClick('Recetas')} />
          <NavigationButton icon={Heart} text="Apoyo" onClick={() => handleNavClick('Apoyo')} />
        </nav>

        {/* Renderiza el componente PregnancyTracker si el usuario está autenticado */}
        {userId ? (
          <PregnancyTracker userId={userId} db={db} appId={appId} />
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
