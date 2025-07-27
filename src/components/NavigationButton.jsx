import React from "react";

/* Componente Navegacion */
//Reciben props para personalizar el texto y el icono

function NavigationButton({ icon: Icon, text, onClick }) {
    //Desestructuramos 'icon' y lo renombramos a 'Icon' para usarlo como componente

    return (
        <button className="flex flex-col items-center p-2 text-sm text-white hover:bg-white hover:opacity-30 rounded-full transition-all duration-200" onClick={onClick}>
            {Icon && <Icon size={24} />} {/* Renderizamos el icono si se proporciona */}
            {<span className="mt-1 hidden md:block">{text}</span>}
        </button>
    )
}

export default NavigationButton;
//Exportamos el componente para usarlo en otros archivos