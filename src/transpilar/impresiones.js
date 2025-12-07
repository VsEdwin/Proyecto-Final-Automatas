// Transpilador de impresiones (console.log → print)

export function transpilarImpresiones(code) {
    
    const lineas = code.split("\n");
    const salida = [];

    for (let linea of lineas) {

        const recortar = linea.trim();

        // Detectar console.log(...)
        if (/^console\.log\s*\(/.test(recortar)) {

            let convertir = recortar
                .replace(/^console\.log\s*\(/, "print(") // console.log → print
                .replace(/;$/, "")                       // eliminar solo el ; final
                .replace(/\btrue\b/gi, "True")           // true → True
                .replace(/\bfalse\b/gi, "False")         // false → False
                .replace(/\bnull\b/gi, "None");          // null → None

            salida.push(convertir);

        } else {
            salida.push(linea);
        }
    }

    return salida.join("\n");
}
