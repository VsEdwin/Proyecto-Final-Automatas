// transpilar/estructuras.js
export function transpilarEstructuras(code) {

    const lineas = code.split("\n");
    const salida = [];
    let indent = 0;

    const ifExp      = /^if\s*\((.*?)\)\s*\{$/;
    const elseIfExp  = /^else\s+if\s*\((.*?)\)\s*\{$/;
    const elseExp    = /^else\s*\{$/;
    const switchExp  = /^switch\s*\((.*?)\)\s*\{$/;
    const caseExp    = /^case\s+(.*?):?$/;
    const defaultExp = /^default\s*:?\s*$/;

    const limpiar = (expr) => {
        return expr
            .replace(/&&/g, "and")
            .replace(/\|\|/g, "or")
            .replace(/!([a-zA-Z_]\w*)/g, "not $1")
            .replace(/\btrue\b/g, "True")
            .replace(/\bfalse\b/g, "False")
            .replace(/\bnull\b/g, "None")
            .replace(/===/g, "==")
            .replace(/!==/g, "!=");
    };

    let switchStack = [];

    for (let linea of lineas) {
        let trim = linea.trim();

        // IF
        if (ifExp.test(trim)) {
            let expr = limpiar(trim.match(ifExp)[1]);
            salida.push(`${"    ".repeat(indent)}if ${expr}:`);
            indent++;
            continue;
        }

        // ELSE IF -> elif
        if (elseIfExp.test(trim)) {
            let expr = limpiar(trim.match(elseIfExp)[1]);
            salida.push(`${"    ".repeat(Math.max(indent-1,0))}elif ${expr}:`);
            continue;
        }

        // ELSE -> else
        if (elseExp.test(trim)) {
            salida.push(`${"    ".repeat(Math.max(indent-1,0))}else:`);
            continue;
        }

        // SWITCH -> lo transformaremos en if/elif usando una pila
        if (switchExp.test(trim)) {
            let variable = limpiar(trim.match(switchExp)[1]);
            switchStack.push({ variable, firstCaseSeen: false });
            continue;
        }

        // CASE
        if (caseExp.test(trim)) {
            if (switchStack.length === 0) {
                // si no hay switch, ignorar como linea normal
            } else {
                let value = trim.match(caseExp)[1].replace(/:$/, "").trim();
                value = limpiar(value);

                let top = switchStack[switchStack.length - 1];

                if (!top.firstCaseSeen) {
                    // primer case -> if
                    salida.push(`${"    ".repeat(indent)}if ${top.variable} == ${value}:`);
                    top.firstCaseSeen = true;
                    indent++;
                } else {
                    // siguientes -> elif (mismo nivel que el if original)
                    salida.push(`${"    ".repeat(Math.max(indent-1,0))}elif ${top.variable} == ${value}:`);
                }
                continue;
            }
        }

        // DEFAULT
        if (defaultExp.test(trim)) {
            if (switchStack.length > 0) {
                salida.push(`${"    ".repeat(Math.max(indent-1,0))}else:`);
                continue;
            }
        }

        // BREAK (dentro switch) -> ignorar, Python no necesita break para switch-transform
        if (/^break;?$/.test(trim)) {
            continue;
        }

        // CIERRE DE BLOQUE }
        if (trim === "}" || trim === "};") {

            // si estamos dentro de un switch y se cierra, limpiar la pila
            if (switchStack.length > 0) {
                // si habíamos abierto cases, aseguramos decrementar indent si fue incrementado
                let top = switchStack[switchStack.length - 1];
                if (top.firstCaseSeen && indent > 0) {
                    indent = Math.max(0, indent - 1);
                }
                switchStack.pop();
                continue;
            }

            indent = Math.max(0, indent - 1);
            continue;
        }

        // LÍNEAS NORMALES: limpiar ; al final y reemplazos simples
        if (trim !== "") {
            // convertir true/false/null y operadores en la línea
            let lineaLimpia = trim
                .replace(/;$/, "")
                .replace(/\btrue\b/g, "True")
                .replace(/\bfalse\b/g, "False")
                .replace(/\bnull\b/g, "None")
                .replace(/===/g, "==")
                .replace(/!==/g, "!=");

            salida.push(`${"    ".repeat(indent)}${lineaLimpia}`);
        }
    }

    return typeof salida === "string" ? salida : salida.join("\n");
}
