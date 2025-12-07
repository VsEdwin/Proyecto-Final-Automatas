export function transpilarCiclos(code) {

    const lineas = code.split("\n");
    const salida = [];
    let indent = 0;

    const forClasico = /^for\s*\(\s*(?:let|var|const)\s+(\w+)\s*=\s*(.*?)\s*;\s*\1\s*([<>]=?|===|!==)\s*(.*?)\s*;\s*\1(\+\+|--)\s*\)\s*\{$/;
    const forOf = /^for\s*\(\s*(?:let|var|const)\s+(\w+)\s+of\s+(.*?)\s*\)\s*\{$/;
    const forIn = /^for\s*\(\s*(?:let|var|const)\s+(\w+)\s+in\s+(.*?)\s*\)\s*\{$/;
    const whileExp = /^while\s*\((.*?)\)\s*\{$/;

    for (let line of lineas) {

        let trim = line.trim();

        //      CICLO FOR CLÁSICO
        if (forClasico.test(trim)) {

            const m = trim.match(forClasico);
            const variable = m[1];
            let inicio = m[2];
            let operador = m[3];
            let fin = m[4];
            let incremento = m[5];

            // Convertir true/false/null
            inicio = fixBooleanNull(inicio);
            fin = fixBooleanNull(fin);

            let rangeCode = "";

            if (incremento === "++") {
                if (operador === "<=") rangeCode = `range(${inicio}, ${fin} + 1)`;
                else rangeCode = `range(${inicio}, ${fin})`;
            }

            if (incremento === "--") {
                if (operador === ">=") rangeCode = `range(${inicio}, ${fin} - 1, -1)`;
                else rangeCode = `range(${inicio}, ${fin}, -1)`;
            }

            salida.push(`${"    ".repeat(indent)}for ${variable} in ${rangeCode}:`);
            indent++;
            continue;
        }

        //          FOR OF
        if (forOf.test(trim)) {
            const m = trim.match(forOf);
            salida.push(`${"    ".repeat(indent)}for ${m[1]} in ${fixBooleanNull(m[2])}:`);
            indent++;
            continue;
        }

        //           FOR IN
        if (forIn.test(trim)) {
            const m = trim.match(forIn);
            salida.push(`${"    ".repeat(indent)}for ${m[1]} in ${fixBooleanNull(m[2])}.keys():`);
            indent++;
            continue;
        }

        //            WHILE
        if (whileExp.test(trim)) {
            let condicion = trim.match(whileExp)[1];
            salida.push(`${"    ".repeat(indent)}while ${fixBooleanNull(condicion)}:`);
            indent++;
            continue;
        }

        //       CIERRE DE BLOQUE }
        if (trim === "}" || trim === "};") {

            if (indent > 0) indent--; // evitar negativos

            continue;
        }

        //     break / continue
        if (/^break;?$/.test(trim)) {
            salida.push(`${"    ".repeat(indent)}break`);
            continue;
        }

        if (/^continue;?$/.test(trim)) {
            salida.push(`${"    ".repeat(indent)}continue`);
            continue;
        }

        //      OTRAS LÍNEAS DENTRO
        if (trim !== "") {
            const fixed = fixBooleanNull(trim.replace(/;$/, ""));
            salida.push(`${"    ".repeat(indent)}${fixed}`);
        }
    }

    return salida.join("\n");
}

//     Conversión rápida de booleanos
function fixBooleanNull(texto) {
    return texto
        .replace(/\btrue\b/g, "True")
        .replace(/\bfalse\b/g, "False")
        .replace(/\bnull\b/g, "None");
}
