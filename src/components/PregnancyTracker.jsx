import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

/*
  Concept: PregnancyTracker Component
  Este componente es el núcleo del seguimiento del embarazo. Ahora permite al usuario ingresar su
  fecha de último período (FUP), calcula la fecha probable de parto (FPP) y la semana actual de embarazo,
  y guarda estos datos en Firestore. También muestra la información calculada.
*/

function PregnancyTracker({ userId, db, appId}) {
  const [pregnancyData, setPregnancyData] = useState(null)
  const [loadingData, setLoadingData] = useState(true);
  const [lastPeriodInput, setLastPeriodInput] = useState(""); 
  const [showForm, setShowForm] = useState(false); //Estado para constrolar la visibilidad del formulario
  const [message, setMessage] = useState(""); //Estado para mensajes al usuario

  useEffect(() => {
    const fetchPregnancyData = async () => {
      if (!userId || !db || !appId) {
        console.log("userId, db o appId no estan disponibles para cargar los datos del embarazo.")
        setLoadingData(false);
        return;
      }

      try {
        //Ruta del documento para datos privados del usuario
        //Concepto: Rutas de Firestore para datos privados
        //Los datos privados de un usuarui deben almacenarse bajo una ruta que incluya su 'userId'
        //Esto garantiza que solo ese usuario pueda acceder a sus propios datos
        //Gracias a las reglas de seguridad de Firestore

        const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/pregnancyData/current`)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPregnancyData(data);
          //Si los datos existen y lastPeriodDate esta configurado, oculta el formulario
          if (data.lastPeriodDate) {
            setShowForm(false);
          } else {
            setShowForm(true); //Muestra el formulario si lastPeriodDate no esta configurado
          }
          console.log("Datos de embarazo cargados:", data)
        } else {
          console.log("No hay datos de embarazo para este usuario. Mostrando formulario para ingresar FUP.");
          setShowForm(true); //Muestra el formulario si no hay datos
        }
      
      } catch (error) {
        console.error('Error al cargar o inicializar los datos del embarazo:', error);
        setMessage("Error al cargar tus datos. Por favor, intentalo de nuevo")
      } finally {
        setLoadingData(false);
      }
    }

    fetchPregnancyData();
  }, [userId, db, appId]);

  //Funcion para calcular la fecha probable de parto y las semanas de embarazo
  const calculatePregnancyData = (lastPeriodDateString) => {
    const lmp = new Date(lastPeriodDateString)
    if (isNaN(lmp.getTime())) {
      return null; // Retorna null si la fecha es inválida
    }

    //Regla de Naegele: Sumar 7 dias a la FUP, restar 3 meses y sumar un ano

    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 7);
    dueDate.setMonth(dueDate.getMonth() - 3)
    dueDate.setFullYear(dueDate.getFullYear() + 1);

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lmp.getTime());
    const diffWeeks = Math.floor(diffTime/ (1000 * 60 * 60 * 24 * 7));

    return {
      lastPeriodDate: lmp.toISOString().split('T')[0], // Almacenar como cadena YYYY-MM-DD
      dueDate: dueDate.toISOString().split('T')[0], // Almacenar como cadena YYYY-MM-DD
      weeksPregnant: diffWeeks,
      status: "active",
      updatedAt: new Date().toISOString(),
    }
  }

  const handleSubmit = async () => {
    if (!lastPeriodInput) {
      setMessage("Por favor, ingresa la fecha de tu ultimo periodo")
      return;
    }

    const calculatedData = calculatePregnancyData(lastPeriodInput);

    if (!calculatedData) {
      setMessage("Fecha inválida. Por favor, ingresa una fecha válida en formato sea correcto");
      return;
    }

    try {
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/pregnancyData/current`);
      await setDoc(userDocRef, calculatedData, { merge: true}); //Usar merge para actializar campos existentes
      setPregnancyData(calculatedData)
      setShowForm(false) //Ocultar el formulario despues de un envio exitoso
      setMessage('Datos guardados con exito!')
      console.log('Datos de embarazo guardados:', calculatedData);
    } catch (error) {
      console.error('Error al guardar los datos de embarazo:', error);
      setMessage("Error al guardar tus datos. Por favor, intentalo de nuevo")
    }
  }

  if (loadingData) {
    return <div>Cargando tus datos de embarazo...</div>;
  }

  return (
    <div className="bg-white bg-opacity-15 rounded-2xl p-6 shadow-xl text-center">
      <h2 className="text-3xl font-bold text-white mb-4">¡Bienvenida al seguimiento de tu embarazo!</h2>
      <p className="text-lg text-purple-200 mb-2">
        Tu ID de usuario: <span className="font-mono text-purple-100 break-all">{userId}</span>
      </p>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'} text-white`}>
          {message}
        </div>
      )}

      {showForm ? (
        <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Ingresa la Fecha de tu Último Período:</h3>
          <input
            type="date"
            value={lastPeriodInput}
            onChange={(e) => setLastPeriodInput(e.target.value)}
            className="p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full md:w-2/3 lg:w-1/2 mb-4"
          />
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Guardar Fecha
          </button>
        </div>
      ) : (
        pregnancyData && (
          <div className="mt-4 text-left p-4 bg-white bg-opacity-10 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Estado Actual:</h3>
            <p className="text-lg text-purple-200">
              Fecha de Último Período: {pregnancyData.lastPeriodDate ? new Date(pregnancyData.lastPeriodDate + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No establecida'}
            </p>
            <p className="text-lg text-purple-200">
              Fecha Probable de Parto: {pregnancyData.dueDate ? new Date(pregnancyData.dueDate + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No establecida'}
            </p>
            <p className="text-lg text-purple-200">
              Semanas de Embarazo: {pregnancyData.weeksPregnant}
            </p>
            <p className="text-lg text-purple-200">
              Estado: {pregnancyData.status}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow transition duration-300 ease-in-out"
            >
              Actualizar Fecha
            </button>
          </div>
        )
      )}
      <p className="text-md text-purple-300 mt-6">
        Este es el punto de partida. En los próximos pasos, añadiremos la funcionalidad completa.
      </p>
    </div>
  );
}

export default PregnancyTracker;
