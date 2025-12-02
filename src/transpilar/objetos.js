export function transpilarObjetos(code) {

    // divide el código en líneas
    const lineas = code.split("\n");
    const salida = [];

    // útil para manejar niveles (indentación)
    let nivel = 0;

    // expresiones regulares
    const inicioObjeto = /^(let|var|const)\s+(\w+)\s*=\s*{$/;
    const propiedad = /^(\w+)\s*:\s*(.*?)(,?)$/;

    // recorre línea por línea
    for (let linea of lineas) {

        const recortar = linea.trim();

        // INICIO de un objeto        
        if (inicioObjeto.test(recortar)) {

            const nombreVar = recortar.match(inicioObjeto)[2];
            salida.push(`${nombreVar} = {`);
            nivel = 1;
            continue;
        }

        // APERTURA de objeto ANIDADO {
        if (recortar.endsWith("{") && propiedad.test(recortar.replace("{", "").trim())) {

            const match = propiedad.exec(recortar.replace("{", "").trim());
            const key = match[1];

            salida.push(`${"    ".repeat(nivel)}"${key}": {`);
            nivel++;
            continue;
        }

        // CIERRE de objeto }
        if (recortar === "}" || recortar === "},") {
            nivel--;
            let coma = recortar.endsWith(",") ? "," : "";
            salida.push(`${"    ".repeat(nivel)}}${coma}`);
            continue;
        }

        // PROPIEDADES normales: clave: valor
        if (propiedad.test(recortar)) {

            let [_, key, valor, coma] = propiedad.exec(recortar);

            // convierte valores JS → Python
            valor = valor
                .replace(/,$/, "")
                .replace(/\btrue\b/g, "True")
                .replace(/\bfalse\b/g, "False")
                .replace(/\bnull\b/g, "None");

            salida.push(`${"    ".repeat(nivel)}"${key}": ${valor}${coma || ","}`);
            continue;
        }

        // si no pertenece a un objeto, mantener igual
        salida.push(linea);
    }

    return salida.join("\n");
}
