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

    //Limpieza general de expresiones JS → Python 
    const limpiar = (expr) => {
        return expr
            .replace(/&&/g, "and")
            .replace(/\|\|/g, "or")
            .replace(/!([^=])/g, "not $1")  // !x  | !(x>2)
            .replace(/\btrue\b/gi, "True")
            .replace(/\bfalse\b/gi, "False")
            .replace(/\bnull\b/gi, "None")
            .replace(/===/g, "==")
            .replace(/!==/g, "!=")
            .trim();
    };

    //Para manejar correctamente nested switches y casos
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
            salida.push(`${"    ".repeat(Math.max(indent - 1, 0))}elif ${expr}:`);
            continue;
        }

        // ELSE
        if (elseExp.test(trim)) {
            salida.push(`${"    ".repeat(Math.max(indent - 1, 0))}else:`);
            continue;
        }

        // SWITCH
        if (switchExp.test(trim)) {
            let variable = limpiar(trim.match(switchExp)[1]);

            //registramos y aumentamos indent
            switchStack.push({
                variable,
                openedCase: false,   // si se usó al menos un case
                indentBefore: indent
            });

            //No imprimimos nada aquí (pero podríamos poner un comentario)
            continue;
        }

        // CASE
        if (caseExp.test(trim)) {

            if (switchStack.length === 0) {
                // No hay switch, tratamos como línea normal
            } else {
                let top = switchStack[switchStack.length - 1];
                let value = limpiar(trim.match(caseExp)[1].replace(/:$/, "").trim());

                // Convertir números, strings, booleanos, etc.
                if (/^".*"$/.test(value) || /^'.*'$/.test(value)) {
                    // value es string, no se procesa más
                } else {
                    value = limpiar(value);
                }

                if (!top.openedCase) {
                    // primer case → if
                    salida.push(`${"    ".repeat(indent)}if ${top.variable} == ${value}:`);
                    indent++;
                    top.openedCase = true;
                } else {
                    // siguientes cases → elif
                    salida.push(`${"    ".repeat(indent - 1)}elif ${top.variable} == ${value}:`);
                }
                continue;
            }
        }

        // DEFAULT
        if (defaultExp.test(trim)) {
            if (switchStack.length > 0) {
                let top = switchStack[switchStack.length - 1];

                // default → else
                salida.push(`${"    ".repeat(Math.max(indent - 1, 0))}else:`);
            }
            continue;
        }

        // BREAK (en switch) → ignorar
        if (/^break;?$/i.test(trim)) {
            continue;
        }

        // CIERRE DE BLOQUE }
        if (trim === "}" || trim === "};") {

            if (switchStack.length > 0) {
                let top = switchStack[switchStack.length - 1];

                // cerrar un switch
                if (top.openedCase) {
                    // si hubo case, reducimos indent a antes del if inicial
                    indent = top.indentBefore;
                }
                switchStack.pop();
                continue;
            }

            // cierre normal de bloque IF o ELSE
            indent = Math.max(0, indent - 1);
            continue;
        }

        // LÍNEA NORMAL
        if (trim !== "") {
            let lineaLimpia = limpiar(trim.replace(/;$/, ""));
            salida.push(`${"    ".repeat(indent)}${lineaLimpia}`);
        }
    }

    return salida.join("\n");
}