// Transpilación de funciones JavaScript → Python
export function transpilarFunciones(code) {

    const lineas = code.split("\n");
    const salida = [];

    let dentroDeFuncion = false;
    let indent = "    ";

    const regexInicioFuncion = /^function\s+(\w+)\s*\((.*?)\)\s*\{/;

    for (let linea of lineas) {

        let trim = linea.trim();

        if (regexInicioFuncion.test(trim)) {

            const match = trim.match(regexInicioFuncion);
            const nombre = match[1];
            const parametros = match[2];

            salida.push(`def ${nombre}(${parametros}):`);

            dentroDeFuncion = true;
            continue;
        }

        if (trim === "}") {
            dentroDeFuncion = false;
            continue;
        }

        if (dentroDeFuncion) {

            let convertida = convertirLineaFuncion(trim);
            salida.push(indent + convertida);
            continue;
        }

        salida.push(linea);
    }

    return salida.join("\n");
}

// Conversión interna de cada línea dentro de funciones
function convertirLineaFuncion(txt) {

    let linea = txt;

    // console.log → print
    linea = linea.replace(/console\.log\s*\((.*?)\);?/g, "print($1)");

    // eliminar ; del final
    linea = linea.replace(/;$/, "");

    // true/false/null
    linea = linea.replace(/\btrue\b/g, "True");
    linea = linea.replace(/\bfalse\b/g, "False");
    linea = linea.replace(/\bnull\b/g, "None");

    // const / let / var → nada
    linea = linea.replace(/^(const|let|var)\s+/, "");

    return linea;
}
