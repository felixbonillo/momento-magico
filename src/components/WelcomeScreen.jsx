//Pantalla de bienvenida inicial de la aplicacion

function WelcomeScreen({ onStart }) {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-pink-700 flex flex-col items-center justify-center text-white z-50 p-4">
            <div className="text-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-purple-100 mb-4 drop-shadow-lg">Mi Dulce Espera</h1>
                <p className="text-xl md:text-2xl text-purple-200 mb-6">
                    Tu compañera en el viaje más hermoso.
                </p>
                <p className="text-lg text-purple-300 mb-8">
                    Prepárate para seguir cada momento de tu embarazo.
                </p>
                <button
                    onClick={onStart}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
                >
                    ¡Comenzar Ahora!
                </button>
            </div>
        </div>
    )

}

export default WelcomeScreen;