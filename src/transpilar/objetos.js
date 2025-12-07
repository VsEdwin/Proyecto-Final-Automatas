export function transpilarObjetos(code) {

    const lineas = code.split("\n");
    const salida = [];

    // niveles de indentación
    let nivel = 0;

    // expresiones regulares
    const inicioObjeto = /^(let|var|const)\s+(\w+)\s*=\s*{$/;
    const propiedad = /^(\w+)\s*:\s*(.*?)(,?)$/;

    for (let linea of lineas) {

        const recortar = linea.trim();

        //IGNORAR ESTRUCTURAS QUE NO SON OBJETOS
        if (/^(function|class|if|for|while|switch)\b/.test(recortar)) {
            salida.push(linea);
            continue;
        }

        //IGNORAR MÉTODOS DE OBJETO
        if (/^\w+\s*:\s*function\s*\(/.test(recortar)) {
            salida.push(linea);
            continue;
        }

        //IGNORAR ARROW FUNCTIONS
        if (/^\w+\s*:\s*\(?.*\)?\s*=>\s*{?/.test(recortar)) {
            salida.push(linea);
            continue;
        }

        //1. INICIO DE OBJETO PRINCIPAL
        if (inicioObjeto.test(recortar)) {
            const nombreVar = recortar.match(inicioObjeto)[2];
            salida.push(`${nombreVar} = {`);
            nivel = 1;
            continue;
        }

        //2. OBJETO ANIDADO
        if (recortar.endsWith("{") && propiedad.test(recortar.replace("{", "").trim())) {

            const match = propiedad.exec(recortar.replace("{", "").trim());
            const key = match[1];

            salida.push(`${"    ".repeat(nivel)}"${key}": {`);
            nivel++;
            continue;
        }

        //3. CIERRE DE OBJETO }
        if (recortar === "}" || recortar === "},") {

            nivel = Math.max(0, nivel - 1);

            const coma = recortar.endsWith(",") ? "," : "";
            salida.push(`${"    ".repeat(nivel)}}${coma}`);
            continue;
        }

        //4. PROPIEDADES NORMALES
        if (propiedad.test(recortar)) {

            let [_, key, valor] = propiedad.exec(recortar);

            valor = valor
                .replace(/,$/, "")
                .replace(/\btrue\b/g, "True")
                .replace(/\bfalse\b/g, "False")
                .replace(/\bnull\b/g, "None");

            salida.push(`${"    ".repeat(nivel)}"${key}": ${valor}`);
            continue;
        }

        //5. LÍNEAS NORMALES
        salida.push(linea);
    }

    return salida.join("\n");
}
