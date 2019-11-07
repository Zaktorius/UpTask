import Swal from "sweetalert2";

export const actualizarAvance = () => {
    // Seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length) {
        // Seleccionar las tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');
        // Calcular el avance
        const avance = Math.round((tareasCompletadas.length * 100) / tareas.length);

        // Mostrar avance
        const porcentaje = document.querySelector("#porcentaje");
        porcentaje.style.width = avance +"%";
        // Validamos si ya llegamos al 100%
        if(avance == 100){
            Swal.fire("¡Felicidades!", "¡Completaste tu Proyecto!", "success");
        }
    }

}