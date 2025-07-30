import React from 'react';

/*
  Concepto: Componente LoadingScreen
  Este componente se utiliza para mostrar una pantalla de carga mientras la aplicación
  realiza operaciones asíncronas, como la inicialización de Firebase o la carga de datos.
  Mejora la experiencia del usuario al indicar que algo está sucediendo.
*/
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-pink-700 flex flex-col items-center justify-center text-white z-50">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-300 mb-4"></div>
      <p className="text-2xl font-semibold">Cargando Momento Mágico...</p>
      <p className="text-lg text-purple-200 mt-2">Preparando tu experiencia...</p>
    </div>
  );
}

export default LoadingScreen;
