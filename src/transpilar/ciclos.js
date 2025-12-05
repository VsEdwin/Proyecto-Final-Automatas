export function transpilarCiclos(code) {

    const lineas = code.split("\n");
    const salida = [];
    let indent = 0;

    // for clásico: soporta espacios opcionales
    const forClasico = /^for\s*\(\s*let\s+(\w+)\s*=\s*(.*?)\s*;\s*\1\s*([<>]=?|===|!==)\s*(.*?)\s*;\s*\1(\+\+|--)\s*\)\s*\{$/;

    // for of
    const forOf = /^for\s*\(\s*let\s+(\w+)\s+of\s+(.*?)\s*\)\s*\{$/;

    // for in
    const forIn = /^for\s*\(\s*let\s+(\w+)\s+in\s+(.*?)\s*\)\s*\{$/;

    // while
    const whileExp = /^while\s*\((.*?)\)\s*\{$/;

    for (let line of lineas) {

        let trim = line.trim();

        if (forClasico.test(trim)) {

            const m = trim.match(forClasico);
            const varName = m[1];
            const start = m[2];
            const op = m[3];
            const end = m[4];
            const inc = m[5]; // ++ o --

            let rangeCode = "";

            // Determinar el range adecuado
            if (op === "<") rangeCode = `range(${start}, ${end})`;
            else if (op === "<=") rangeCode = `range(${start}, ${end}+1)`;
            else if (op === ">") rangeCode = `range(${start}, ${end}, -1)`;
            else if (op === ">=") rangeCode = `range(${start}, ${end}-1, -1)`;

            salida.push(`${"    ".repeat(indent)}for ${varName} in ${rangeCode}:`);
            indent++;
            continue;
        }

        // ======= FOR OF =======
        if (forOf.test(trim)) {
            const m = trim.match(forOf);
            salida.push(`${"    ".repeat(indent)}for ${m[1]} in ${m[2]}:`);
            indent++;
            continue;
        }

        // ======= FOR IN =======
        if (forIn.test(trim)) {
            const m = trim.match(forIn);
            salida.push(`${"    ".repeat(indent)}for ${m[1]} in ${m[2]}.keys():`);
            indent++;
            continue;
        }

        // ======= WHILE =======
        if (whileExp.test(trim)) {
            const m = trim.match(whileExp);
            salida.push(`${"    ".repeat(indent)}while ${m[1]}:`);
            indent++;
            continue;
        }

        // ======= CIERRE } =======
        if (trim === "}" || trim === "};") {
            indent--;
            continue;
        }

        // ======= break =======
        if (/^break;?$/.test(trim)) {
            salida.push(`${"    ".repeat(indent)}break`);
            continue;
        }

        // ======= continue =======
        if (/^continue;?$/.test(trim)) {
            salida.push(`${"    ".repeat(indent)}continue`);
            continue;
        }

        // ======= líneas internas =======
        if (trim !== "") {
            salida.push(`${"    ".repeat(indent)}${trim.replace(/;$/, "")}`);
        }
    }

    return salida.join("\n");
}
