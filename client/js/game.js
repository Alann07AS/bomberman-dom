
class Game {
    constructor(){}

    slots = [new Player(), new Player(), new Player(), new Player()]

    getFirstFreeSlot() {
        return this.slots.find((v)=>{
            return !v.status.ready
        })
    }
}

class Player {
    constructor(){}

    /**@type {Controleur} */
    controleur

    status = {
        ready: false
    }
    info= {
        name: "",
        image: "./style/default_user_void.png",
    }
    speed = 10
    position = {x:0, y:0}
    get move() {
        const th = this
        return class {
            static left = ()=>{
                th.position.x -= th.speed
                mn.data.update("slots_change", v=>v)
            }
            static right = ()=>{
                th.position.x += th.speed
                mn.data.update("slots_change", v=>v)
            }
            static up = ()=>{
                th.position.y -= th.speed
                mn.data.update("slots_change", v=>v)
            }
            static down = ()=>{
                th.position.y += th.speed
                mn.data.update("slots_change", v=>v)
            }
        }
    }

    /**
     * @param {Controleur} controleur 
     * @param {*} manquedestrucla 
     */
    bind(controleur, manquedestrucla) {
        this.status.ready = true;
        this.info.image = "./style/default_user.png"
        controleur.data = this
        this.controleur = controleur
        mn.data.update("slots_change")
    }
}


const game = new Game()