// src/utils/jqueryYselect2.js

import $ from 'jquery';
import 'select2';
import 'select2/dist/css/select2.min.css';


//Recive la cajita (variable asignada cada select) y opciones o por defecto vacia si no le llega nada
export function initSelect2(ref, options = {}) {
  if (ref.current) { // Si existe cajita (select)
    const cfg = { //Si existe cxreamos variable configurtacion en este caso y le asignamos atributos
      width: '100%',
      dropdownParent: $(ref.current).closest('.modal'), //.modal esta por defecto en el modal al usar react-bootstrap
      ...options //este agarra lo que se le paso como un placeholder
    };
    $(ref.current).select2(cfg); //Aplica Select2 a la cajita con esas instrucciones.
  }
}

export function destroySelect2(ref) {
  // Solo si el ref existe y el select tiene la clase de Select2
  if (ref.current && $(ref.current).hasClass('select2-hidden-accessible')) {
    $(ref.current).select2('destroy');
  }
}

export default $;

