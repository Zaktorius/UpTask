import Swal from 'sweetalert2';
import Axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

btnEliminar.addEventListener('click', (e) => {
    Swal.fire({
        title: '¿Estas seguro de querer eliminar el proyecto?',
        text: "Un proyecto eliminado no se puede recuperar",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrarlo',
        cancelButtonText: "No, Cancelar"
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Eliminado',
            'Tu proyecto ha sido eliminado',
            'Correcto'
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }
      })
});