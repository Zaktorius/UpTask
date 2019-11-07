import axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;            
            // Request hacia /tareas
            const url = `${location.origin}/tareas/${idTarea}`;
            // Logueamos el url
            axios.patch(url, {idTarea})
            .then(respuesta => {
                if(respuesta.status == 200){
                    // En caso de cambiarse correctamente, se establece el estilo
                    e.target.classList.toggle('completo');
                    // Actualizamos el avance
                    actualizarAvance();
                }
            });
        }
        // Cuando se elige el icono trash hay que levantar el html de tarea completo
        if(e.target.classList.contains('fa-trash')){
            // Levantamos el HTML de tarea y sacamos el ID
            const tareaHTML = e.target.parentElement.parentElement,
            idTarea = tareaHTML.dataset.tarea;
            //console.log(urlProyecto);
            Swal.fire({
                title: '¿Estas seguro de querer eliminar la tarea?',
                text: "La tarea eliminada no se puede recuperar",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrarlo',
                cancelButtonText: "No, Cancelar"
            }).then((result) => {
                if (result.value) {
                    // Preparamos la URL para realizar la eliminacion de la tarea
                    const url = `${location.origin}/tareas/${idTarea}`;
                    // Ejecutamos la petición por axios
                    axios.delete(url, {params: idTarea})
                    .then(respuesta => {
                        // Validamos que la respuesta sea correcta
                        if(respuesta.status == 200) {
                            // Removemos la tarea del html
                            tareaHTML.parentElement.removeChild(tareaHTML);
                            // Lanzamos un dialog informando eliminación                            
                            Swal.fire('Eliminado', respuesta.data, 'success');
                            // Actualizamos el avance
                            actualizarAvance();
                        }
                    })
                }
            });

        }

        
    })
}

export default tareas;