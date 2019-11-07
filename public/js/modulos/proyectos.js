import Swal from 'sweetalert2';
import Axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
  btnEliminar.addEventListener('click', (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    //console.log(urlProyecto);
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
        // Enviar petición a Axios
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        // Solicitamos por delete a Axios
        Axios.delete(url, { params: {urlProyecto} })
          .then(respuesta => {
            console.log(respuesta);            
            Swal.fire(
              'Eliminado',
              respuesta.data,
              'Success'
            );
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          }) // En caso de error de promise
          .catch(error => {
            Swal.fire({
              type:'error',
              title: 'hubo un error',
              text: 'No se pudo eliminar el proyecto.'
            });
          });
        return;        
      }
    })
  });
}

export default btnEliminar;

