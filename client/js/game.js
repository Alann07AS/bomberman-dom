const wall = new Array(13)
wall.fill(1, 0, 13)

const line = new Array(13)
line.fill(0, 0, 13)
line[0] = line[12] = 1

let line2 = new Array(13)
line2.fill([1, 0], 0, 6)
line2 = line2.flat()
line2.push(1)

let wall_matrix = [
    [...wall],
    [...line],
    // [...line],
    [...line2],
    [...line],
    [...line2],
    [...line],
    [...line2],
    [...line],
    [...line2],
    [...line],
    [...line2],
    [...line],
    [...wall],
]

// wall_matrix = [
//     [0, 0],
//     [0, 0],
//     [0, 0, 1],
// ]

class Wall {
    static size = 50
    constructor(val, i_line, i_col) {
        this.type = (val === 1 ? "hardwall" : val === 2 ? "softwall" : "grass")
        this.position = {
            x: Wall.size * i_line,
            y: Wall.size * i_col,
        }
    }

    get wallCenter() {
        return { x: this.position.x + Wall.size / 2, y: this.position.y + Wall.size / 2 }
    }
}
wall_matrix = wall_matrix.map((v, i_line) => v.map((v2, i_col) => new Wall(v2, i_line, i_col)).filter(v => v.type !== "grass"))
console.log(wall_matrix);


// wall_matrix.forEach(v=>console.log(...v))
// 


class Game {
    constructor() { }

    slots = [
        new Player("./style/sprites/white.png", { x: Wall.size * 1, y: Wall.size * 1 }),
        new Player("./style/sprites/red.png", { x: Wall.size * 11, y: Wall.size * 1 }),
        new Player("./style/sprites/blue.png", { x: Wall.size * 1, y: Wall.size * 11 }),
        new Player("./style/sprites/black.png", { x: Wall.size * 11, y: Wall.size * 11 })
    ]

    getFirstFreeSlot() {
        return this.slots.find((v) => {
            return !v.status.ready
        }) || new Player()
    }
}

class Player {
    constructor(avatar, position) {
        this.info.image = avatar
        this.position = position
    }

    static height = 50
    static width = 50
    static moveAsist = 2

    /**@type {Controleur} */
    controleur

    status = {
        ready: false
    }
    info = {
        name: "",
        image: "./style/default_user_void.png",
    }
    speed = 1.4
    position = { x: 0, y: 0 }
    get move() {
        const th = this
        
        return class {
            static left = () => {
                th.position.x -= th.speed
                if (th.checkColision) {
                    th.position.x += th.speed
                } else {
                    th.position.y = Math.round((th.position.y / Wall.size)) * Wall.size
                    mn.data.update("slots_change", v => v)
                }
            }
            static right = () => {
                th.position.x += th.speed
                if (th.checkColision) {
                    th.position.x -= th.speed
                } else {
                    th.position.y = Math.round((th.position.y / Wall.size)) * Wall.size
                    mn.data.update("slots_change", v => v)
                }
            }
            static up = () => {
                th.position.y -= th.speed
                if (th.checkColision) {
                    th.position.y += th.speed
                } else {
                    th.position.x = Math.round((th.position.x / Wall.size)) * Wall.size
                    mn.data.update("slots_change", v => v)
                }
            }
            static down = () => {
                th.position.y += th.speed
                if (th.checkColision) {
                    th.position.y -= th.speed
                } else {
                    th.position.x = Math.round((th.position.x / Wall.size)) * Wall.size
                    mn.data.update("slots_change", v => v)
                }
            }
        }
    }

    get playerCenter() {
        return { x: this.position.x + Player.width / 2, y: this.position.y + Player.height / 2 }
    }

    /**@param {Wall} obj */ //ou bomb
    objDist(obj) {
        const playerPos = this.playerCenter
        const wallPos = obj.wallCenter
        return {
            x: Math.abs(playerPos.x - wallPos.x) - Player.width / 2 - Wall.size / 2 ,
            y: Math.abs(playerPos.y - wallPos.y) - Player.height / 2 - Wall.size / 2 
        }
    }

    get checkColision() {
        return wall_matrix.some(line => {
            return line.some(wall=>{
                const playerDist = this.objDist(wall)
                return playerDist.x < 0-Player.moveAsist && playerDist.y < 0-Player.moveAsist
            })
        })
    }

    /**
     * @param {Controleur} controleur 
     * @param {*} manquedestrucla 
     */
    bind(controleur, manquedestrucla) {
        this.status.ready = true;
        // this.info.image = "./style/default_user.png"
        controleur.data = this
        this.controleur = controleur
        mn.data.update("slots_change")
    }
}


const game = new Game()