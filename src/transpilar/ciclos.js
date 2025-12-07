export function transpilarCiclos(code) {

    const lineas = code.split("\n");
    const salida = [];
    let indent = 0;

    const forClasico = /^for\s*\(\s*let\s+(\w+)\s*=\s*(.*?)\s*;\s*\1\s*([<>]=?|===|!==)\s*(.*?)\s*;\s*\1(\+\+|--)\s*\)\s*\{$/;
    const forOf = /^for\s*\(\s*let\s+(\w+)\s+of\s+(.*?)\s*\)\s*\{$/;
    const forIn = /^for\s*\(\s*let\s+(\w+)\s+in\s+(.*?)\s*\)\s*\{$/;
    const whileExp = /^while\s*\((.*?)\)\s*\{$/;

    for (let line of lineas) {

        let trim = line.trim();

        // ===== CICLOS =====
        if (forClasico.test(trim)) {
            const m = trim.match(forClasico);
            const start = m[2], op = m[3], end = m[4];

            let rangeCode = "";
            if (op === "<") rangeCode = `range(${start}, ${end})`;
            else if (op === "<=") rangeCode = `range(${start}, ${end}+1)`;
            else if (op === ">") rangeCode = `range(${start}, ${end}, -1)`;
            else if (op === ">=") rangeCode = `range(${start}, ${end}-1, -1)`;

            salida.push(`${"    ".repeat(indent)}for ${m[1]} in ${rangeCode}:`);
            indent++;
            continue;
        }

        if (forOf.test(trim)) {
            const m = trim.match(forOf);
            salida.push(`${"    ".repeat(indent)}for ${m[1]} in ${m[2]}:`);
            indent++;
            continue;
        }

        if (forIn.test(trim)) {
            const m = trim.match(forIn);
            salida.push(`${"    ".repeat(indent)}for ${m[1]} in ${m[2]}.keys():`);
            indent++;
            continue;
        }

        if (whileExp.test(trim)) {
            const m = trim.match(whileExp);
            salida.push(`${"    ".repeat(indent)}while ${m[1]}:`);
            indent++;
            continue;
        }

        // ===== CIERRE } SOLO DE CICLOS =====
        if (trim === "}" || trim === "};") {

            // evita valores negativos
            if (indent > 0) indent--;

            continue;
        }

        // ===== break / continue =====
        if (/^break;?$/.test(trim)) {
            salida.push(`${"    ".repeat(indent)}break`);
            continue;
        }

        if (/^continue;?$/.test(trim)) {
            salida.push(`${"    ".repeat(indent)}continue`);
            continue;
        }

        // ===== OTRAS LÍNEAS =====
        if (trim !== "") {
            salida.push(`${"    ".repeat(indent)}${trim.replace(/;$/, "")}`);
        }
    }

    return salida.join("\n");
}
