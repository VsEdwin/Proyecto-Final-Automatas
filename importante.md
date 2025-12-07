Test

Declaración de variables:

String
    let nombre = "Yeda";
    const saludo = 'Hola Mundo';

Int	
    let edad = 25;
    var cantidad = -10;

float
    let precio = 99.99;
    const temperatura = -12.5;

Boolean
    let activo = true;
    const terminado = false;

Null
    let vacio = null;
    const nada = null;

Impresiones:
    let nombre = "Juan";
    console.log("Hola " + nombre);
    console.log(25);
    console.log(true);
    console.log(null);
    let x = 10;
    console.log(x + 5);

Objetos
    const persona = {
        nombre: "Cersar",
        edad: 30,
        activo: false,
        pais: null
    };

    const user = {
        username: "Carlos",
        edad: 25,
        datos: {
            direccion: {
                calle: "Roma",
                numero: 55
            },
            activo: true
        },
        rol: null
    };

Arreglos
    const nums = [1, 2, 3];

    let datos = ["Ana", 24, true, null];
    
    const users = [
        { nombre: "Luis", edad: 20 },
        { nombre: "Ana", edad: 30 }
    ];

Ciclos
    for (let i = 0; i < 5; i++) {
        console.log(i);
    }

    for (let n = 1; n <= 5; n++) {
    console.log("Num:", n);
    }

    let frutas = ["manzana", "pera", "uva"];
    for (let f of frutas) {
        console.log(f);
    }

    let persona = {
        nombre: "Yeda",
        edad: 21,
        activo: true
    };

    for (let key in persona) {
        console.log(key, persona[key]);
    }

    let i = 0;
    while (i < 4) {
        console.log("i =", i);
        i++;
    }

    function contar() {
        for (let i = 0; i < 3; i++) {
            console.log("i =", i);

            for (let j = 0; j < 2; j++) {
                console.log("j =", j);
            }
        }
    }

