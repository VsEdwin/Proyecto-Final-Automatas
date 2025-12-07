import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../dist/public/css/main.css';
import Swal from 'sweetalert2';

// Importación de módulos
import { transpilarVariables } from "./transpilar/variables.js";
import { transpilarImpresiones } from "./transpilar/impresiones.js";
import { transpilarObjetos } from "./transpilar/objetos.js";
import { transpilarArreglos } from "./transpilar/arreglos.js";
import { transpilarFunciones } from "./transpilar/funciones.js";
import { transpilarCiclos } from "./transpilar/ciclos.js";
import { transpilarEstructuras } from "./transpilar/estructuras.js";

//Fucniones global para transpilar todo el codigo
function transpilarTodo(code) {
    let salida = code;

    salida = transpilarImpresiones(salida);
    salida = transpilarVariables(salida);
    salida = transpilarFunciones(salida);
    salida = transpilarCiclos(salida);
    salida = transpilarObjetos(salida);
    salida = transpilarArreglos(salida);
    salida = transpilarEstructuras(salida);

    return salida;
}

document.addEventListener("DOMContentLoaded", () => {

    // Elementos de la interfaz
    const entrada = document.getElementById("entrada");
    const salida = document.getElementById("salida");
    const btntranspilar = document.getElementById("btntranspilar");
    const btnlimpiar = document.getElementById("btnlimpiar");

    //boton de transpilar
    btntranspilar.addEventListener("click", () => {

        let codigo = entrada.value.trim();

        //Validación de código vacío
        if (codigo === "") {
            Swal.fire({
                icon: "warning",
                title: "Código vacío",
                text: "Por favor escribe algo antes de transpilar."
            });
            return;
        }

        //Validación básica de sintaxis JavaScript
        const esJS = /let |var |const |function|\{|\}|\(|\)|=>|console\.log/.test(codigo);

        if (!esJS) {
            Swal.fire({
                icon: "error",
                title: "Código no válido",
                text: "Lo que ingresaste no parece ser código JavaScript.",
                footer: "Solo se aceptan estructuras y sintaxis de JavaScript."
            });
            return;
        }

        //Intento de transpilación
        try {
            const codigoTranspilado = transpilarTodo(codigo);
            salida.value = codigoTranspilado;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al transpilar",
                text: error.message
            });
        }

    });

    btnlimpiar.addEventListener("click", () => {
        entrada.value = "";
        salida.value = "";
    });
});