import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../dist/public/css/main.css';
import Swal from 'sweetalert2';

//Importacion de los modulos
import { transpilarVariables } from "./transpilar/variables.js";
import { transpilarImpresiones } from "./transpilar/impresiones.js";
import { transpilarObjetos } from "./transpilar/objetos.js"

document.addEventListener("DOMContentLoaded", () => {

    //Sacar info de los Id y botones
    const entrada = document.getElementById("entrada");
    const salida = document.getElementById("salida");
    const btntranspilar = document.getElementById("btntranspilar");
    const btnlimpiar = document.getElementById("btnlimpiar");

    btntranspilar.addEventListener("click", () => {

        // Obtiene el código ingresado
        let codigo = entrada.value;

        // Valida si está vacío y manda alerta
        if (codigo.trim() === "") {
            Swal.fire("Atención", "El área de entrada está vacía.", "warning");
            return;
        }

        // Ejecuta el transpilador de variables
        codigo = transpilarVariables(codigo);

        //Ejecuta el transpilador de impresiones
        codigo = transpilarImpresiones(codigo);

        //Ejecuta el transpilador de objetos
        codigo = transpilarObjetos(codigo);

        // Muestra el resultado final
        salida.value = codigo;
    });

    btnlimpiar.addEventListener("click", () => {
        entrada.value = "";
        salida.value = "";
    });
});