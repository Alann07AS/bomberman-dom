
class Game {
    constructor(){}

    slots = [new Player(), new Player(), new Player(), new Player()]
}

class Player {
    constructor(){}

    status = {
        ready: false
    }
    info= {
        name: "",
        image: "./style/default_user_void.png",
    }

    bind(manquedestrucla) {
        this.status = true;
        this.info.image = "./style/default_user.png"
        mn.data.update("slots_change")
    }
}


const game = new Game()