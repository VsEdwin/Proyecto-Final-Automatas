// Transpilación de funciones JavaScript → Python
export function transpilarFunciones(code) {

    const lineas = code.split("\n");
    const salida = [];

    let dentroDeFuncion = false;
    const indent = "    ";

    const regexInicioFuncion = /^function\s+(\w+)\s*\((.*?)\)\s*\{/;

    for (let linea of lineas) {

        let trim = linea.trim();

        //Detectar inicio de función
        if (regexInicioFuncion.test(trim)) {

            const match = trim.match(regexInicioFuncion);
            const nombre = match[1];
            let parametros = match[2].trim();

            //Quitar espacios innecesarios
            parametros = parametros
                .split(",")
                .map(p => p.trim())
                .filter(p => p !== "")
                .join(", ");

            salida.push(`def ${nombre}(${parametros}):`);

            dentroDeFuncion = true;
            continue;
        }

        //Fin de una función
        if (trim === "}") {
            dentroDeFuncion = false;
            continue;
        }

        //Procesar código dentro de la función
        if (dentroDeFuncion) {

            let convertida = convertirLineaFuncion(trim);

            // Evitar líneas vacías con indent
            if (convertida !== "") {
                salida.push(indent + convertida);
            } else {
                salida.push("");
            }

            continue;
        }

        //Línea fuera de función → no se modifica
        salida.push(linea);
    }

    return salida.join("\n");
}

// Conversión interna de líneas
function convertirLineaFuncion(txt) {

    let linea = txt.trim();

    if (linea === "") return "";

    // console.log → print
    linea = linea.replace(/console\.log\s*\((.*?)\);?/g, "print($1)");

    // return sin punto y coma
    linea = linea.replace(/^return\s+(.*);?$/, "return $1");

    // true/false/null
    linea = linea.replace(/\btrue\b/g, "True");
    linea = linea.replace(/\bfalse\b/g, "False");
    linea = linea.replace(/\bnull\b/g, "None");

    // const / let / var → eliminar
    linea = linea.replace(/^(const|let|var)\s+/, "");

    // ; del final
    linea = linea.replace(/;$/, "");

    return linea;
}
