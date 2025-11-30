import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../dist/public/css/main.css';
import Swal from 'sweetalert2';

//Importacion de los modulos
import { transpilarVariables } from "./transpilar/variables.js";

document.addEventListener("DOMContentLoaded", () => {

    //Sacar info de los Id y botones
    const entrada = document.getElementById("entrada");
    const salida = document.getElementById("salida");
    const btntranspilar = document.getElementById("btntranspilar");
    const btnlimpiar = document.getElementById("btnlimpiar");

    btntranspilar.addEventListener("click", () => {

        //obtiene el codigo que se ingreso 
        const codigo = entrada.value;

        //Valida si se encuentra vacia y manda la alerta
        if (codigo.trim() === "") {
            Swal.fire("Atención", "El área de entrada está vacía.", "warning");
            return;
        }

        //llama a la funcion para hacer la traduccion
        const resultado = transpilarVariables(codigo);

        //Muestra el resultado
        salida.value = resultado;
    });

    btnlimpiar.addEventListener("click", () => {
        entrada.value = "";
        salida.value = "";
    });
});