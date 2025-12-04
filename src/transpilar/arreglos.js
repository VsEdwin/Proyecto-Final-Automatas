// Transpilación de arreglos JS → listas Python

export function transpilarArreglos(code) {

    // separa el código en líneas
    const lineas = code.split("\n");
    const salida = [];

    // regex para detectar declaración de arreglo
    const arregloRegex = /^(let|var|const)\s+(\w+)\s*=\s*\[(.*)$/;

    // recorre cada línea
    for (let linea of lineas) {

        const recortar = linea.trim();

        // ARREGLO que empieza en esta línea
        if (arregloRegex.test(recortar)) {

            const nombre = recortar.match(arregloRegex)[2];

            // si la línea termina con ]
            if (recortar.endsWith("];") || recortar.endsWith("]")) {

                let contenido = recortar
                    .replace(/^(let|var|const)\s+(\w+)\s*=\s*/, "")
                    .replace(/;/g, "");

                contenido = convertirValoresArreglo(contenido);

                salida.push(`${nombre} = ${contenido}`);
            } else {

                // arreglo multi-línea
                salida.push(`${nombre} = [`);
            }

        }

        // FINAL de arreglo multi-línea
        else if (recortar === "];" || recortar === "]") {
            salida.push("]");
        }
    
        // LÍNEA dentro de un arreglo multi-línea
        else if (recortar.endsWith(",") || recortar.match(/^[^:]+\]?,?$/)) {

            let contenido = convertirValoresArreglo(recortar.replace(/,$/, ""));
            salida.push(`    ${contenido},`);
        }

        // LÍNEA normal
        else {
            salida.push(linea);
        }
    }

    return salida.join("\n");
}

// Función auxiliar para convertir valores del arreglo
function convertirValoresArreglo(texto) {

    return texto
        .replace(/\btrue\b/g, "True")
        .replace(/\bfalse\b/g, "False")
        .replace(/\bnull\b/g, "None");
}
