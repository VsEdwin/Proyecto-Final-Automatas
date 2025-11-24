class Game {
    #username;
    #vida;
    #energia;
    #ki;
    //Tarea
    #semillas;

    constructor(username) {
        this.#username = username;
        this.username = username;
        this.#vida = 1000;
        this.#energia = 1000;
        this.#ki = 1000;
        this.mostrar_stats();
        //Tarea
        this.#semillas = 0;
    }

    getVida() {
        return this.#vida
    }

    getEnergia() {
        return this.#energia;
    }

    getKi() {
        return this.#ki;
    }

    getsemillas() {
        return this.#semillas;
    }

    mostrar_stats() {
        console.log(`${this.#username} => Vida: ${this.#vida}, Energía: ${this.#energia}, Ki: ${this.#ki}`);
    }

    descremeto_vida() {
        this.#vida = this.#vida - 175 >= 0 ? this.#vida - 175 : 0;
        this.mostrar_stats();
    }

    descremeto_vida_especial() {
        this.#vida = this.#vida - 300 >= 0 ? this.#vida - 300 : 0;
        this.mostrar_stats();
    }

    atk_basico(player) {
        this.#energia = this.#energia - 150 >= 0 ? this.#energia - 150 : 0;
        this.#ki = this.#ki - 200 >= 0 ? this.#ki - 200 : 0;
        console.log(`${this.#username} lanza un ataque básico`);
        player.descremeto_vida();
    }

    atk_especial(player) {
        console.log(`${this.#username} lanza un ATAQUE ESPECIAL`);
        this.#energia = this.#energia - 300 >= 0 ? this.#energia - 300 : 0;
        this.#ki = this.#ki - 500 >= 0 ? this.#ki - 500 : 0;
        player.descremeto_vida_especial();
        this.mostrar_stats();
    }

    //Tarea
    cargarKi() {
        this.#ki = Math.min(1000, this.#ki + 300);
        this.#energia = Math.min(1000, this.#energia + 200);
        console.log(`${this.#username} carga su Ki y Energía`);
        this.mostrar_stats();
    }

    usarSemilla() {
        if (!this.#semillas) this.#semillas = 0;
        if (this.#semillas < 2) {
            this.#vida = 1000;
            this.#energia = 1000;
            this.#ki = 1000;
            this.#semillas++;
            console.log(`${this.#username} usó una Semilla del Ermitaño (${this.#semillas}/2)`);
            this.mostrar_stats();
            return true;
        } else {
            console.log(`${this.#username} ya usó todas sus semillas`);
            return false;
        }
    }

}


export default Game;
