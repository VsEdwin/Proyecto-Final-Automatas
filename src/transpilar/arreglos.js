// Transpilación de arreglos JS → listas Python
export function transpilarArreglos(code) {

    const lineas = code.split("\n");
    const salida = [];
    let dentroArreglo = false;
    let nombreArreglo = "";

    const inicioArreglo = /^(let|var|const)\s+(\w+)\s*=\s*\[(.*)$/;

    for (let linea of lineas) {

        const trim = linea.trim();

        //     INICIO DE ARREGLO
        if (inicioArreglo.test(trim)) {

            const match = trim.match(inicioArreglo);
            nombreArreglo = match[2];
            let contenido = match[3];

            //Caso: arreglo en una sola línea 
            if (trim.endsWith("]") || trim.endsWith("];")) {

                contenido = contenido
                    .replace(/];?$/, "]")
                    .trim();

                contenido = convertirValores(contenido);

                salida.push(`${nombreArreglo} = ${contenido}`);
            }

            //Caso: arreglo en varias líneas
            else {
                salida.push(`${nombreArreglo} = [`);
                dentroArreglo = true;
            }

            continue;
        }

        //     FIN DE ARREGLO MULTILÍNEA
        if (dentroArreglo && (trim === "]" || trim === "];")) {
            salida.push("]");
            dentroArreglo = false;
            nombreArreglo = "";
            continue;
        }

        //   CONTENIDO DEL ARREGLO
        if (dentroArreglo) {

            // Quitar coma final si existe
            let lineaLimpia = trim.replace(/,$/, "");

            // Convertir true/false/null
            lineaLimpia = convertirValores(lineaLimpia);

            // Agregar coma correcta (Python permite coma final)
            salida.push(`    ${lineaLimpia},`);

            continue;
        }

        //     LÍNEA NORMAL
        salida.push(linea);
    }

    return salida.join("\n");
}

//      Conversión básica de valores
function convertirValores(texto) {
    return texto
        .replace(/\btrue\b/g, "True")
        .replace(/\bfalse\b/g, "False")
        .replace(/\bnull\b/g, "None");
}
