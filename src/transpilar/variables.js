//importa la funcion
export function transpilarVariables(code) {

    //divide el codigoo en lineas para su verificacion
    const lineas = code.split("\n");
    const salida = [];

    //recorre cada linea
    for (let linea of lineas) {
        const recortar = linea.trim();

        //verificar si es variable de js
        if (/^(let|var|const)\s+/.test(recortar)) {

            //convertir a pyhton
            let convertir = recortar
                .replace(/^(let|var|const)\s+/, "")
                .replace(/;/g, "");

           
            //tipos de variables
            //obtiene valor después de "="
            let valor = convertir.split("=")[1]?.trim();
            let tipo = "";

            if (valor) {

                //string
                if (/^".*"$/g.test(valor) || /^'.*'$/.test(valor)) {
                    tipo = "str";
                }

                //entero
                else if (/^-?\d+$/.test(valor)) {
                    tipo = "int";
                }

                //decimal
                else if (/^-?\d+\.\d+$/.test(valor)) {
                    tipo = "float";
                }

                //booleano
                else if (/^(true|false)$/i.test(valor)) {
                    tipo = "bool";
                    convertir = convertir
                        .replace(/\btrue\b/gi, "True")
                        .replace(/\bfalse\b/gi, "False");
                }

                //null
                else if (/^null$/i.test(valor)) {
                    tipo = "null";
                    convertir = convertir.replace(/\bnull\b/gi, "None");
                }
            }

            //agrega comentario del tipo si existe
            if (tipo !== "") {
                convertir += `  # ${tipo}`;
            }

            //guarda las nuevas variables
            salida.push(convertir);

        } else {
            salida.push(linea);
        }
    }

    //devuelve el codigo
    return salida.join("\n");
}
