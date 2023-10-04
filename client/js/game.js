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
//     [0, 1],
//     [0, 0, 0],
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


// BOMB 


class Bomb {
    constructor() {

    }
    sprite = "./style/sprites/bomb.png"
    duration = 5 //second
    active_timestamp
    active = false
    position = { x: 0, y: 0 }
    static size = 49

    static getFirstFreeBomb(bombs) {
        return bombs.find((v) => {
            return !v.active
        }) || undefined
    }

    get bombCenter() {
        return { x: this.position.x + Wall.size / 2, y: this.position.y + Wall.size / 2 }
    }

    pose(position) {
        this.active_timestamp = Date.now()
        this.position = {
            x: Math.round((position.x / Wall.size)) * Wall.size,
            y: Math.round((position.y / Wall.size)) * Wall.size,
        }
        this.active = true
        console.log("C'est poser");
        // time loop ? timeout ?
        mn.data.update("bombs", b => b)
    }

}


class Game {
    constructor() {
        this.updateBombsList()
    }

    slots = [
        new Player(this, "./style/sprites/white.png", { x: Wall.size * 1, y: Wall.size * 1 }),
        new Player(this, "./style/sprites/red.png", { x: Wall.size * 11, y: Wall.size * 1 }),
        new Player(this, "./style/sprites/blue.png", { x: Wall.size * 1, y: Wall.size * 11 }),
        new Player(this, "./style/sprites/black.png", { x: Wall.size * 11, y: Wall.size * 11 })
    ]

    wall_matrix = [...wall_matrix]

    updateBombsList() {
        this.bombs = this.slots.map(j => j.bombs).flat()
    }

    bombs

    getFirstFreeSlot() {
        return this.slots.find((v) => {
            return !v.status.ready
        }) || undefined
    }
}

class Player {
    /**
     * 
     * @param {Game} game 
     * @param {string} avatar 
     * @param {Object} position 
     */
    constructor(game, avatar, position) {
        this.game = game
        this.info.image = avatar
        this.position = position
    }

    static height = 50
    static width = 50
    #moveAsist = {
        x: 0,
        y: 0
    }
    get moveAsistX() {
        return this.#moveAsist.x
    }
    get moveAsistY() {
        return this.#moveAsist.y
    }
    set moveAsistX(x) {
        this.#moveAsist.y = 0
        this.#moveAsist.x = x
    }
    set moveAsistY(y) {
        this.#moveAsist.x = 0
        this.#moveAsist.y = y
    }

    /**@type {Controleur} */
    controleur

    status = {
        ready: false
    }
    info = {
        name: "",
        image: "./style/default_user_void.png",
    }
    // #isMoving
    speed = 1.4
    position = { x: 0, y: 0 }
    get move() {
        const th = this
        return class {
            static left = () => {
                let colistionBomb = th.checkBombColision
                th.position.x -= th.speed
                let colistionBomb2 = th.checkBombColision
                th.moveAsistY = 10
                if (th.checkColision || (!colistionBomb && colistionBomb2)) {
                    th.position.x += th.speed
                } else {
                    th.position.y += ((Math.round((th.position.y / Wall.size)) * Wall.size) - th.position.y) / 10
                    mn.data.update("slots_change", v => v)
                }
            }
            static right = () => {
                let colistionBomb = th.checkBombColision
                th.position.x += th.speed
                let colistionBomb2 = th.checkBombColision
                th.moveAsistY = 10
                if (th.checkColision || (!colistionBomb && colistionBomb2)) {
                    th.position.x -= th.speed
                } else {
                    th.position.y += ((Math.round((th.position.y / Wall.size)) * Wall.size) - th.position.y) / 10
                    // th.position.y = Math.round((th.position.y / Wall.size)) * Wall.size
                    mn.data.update("slots_change", v => v)
                }
            }
            static up = () => {
                let colistionBomb = th.checkBombColision
                th.position.y -= th.speed
                let colistionBomb2 = th.checkBombColision
                th.moveAsistX = 10
                if (th.checkColision || (!colistionBomb && colistionBomb2)) {
                    th.position.y += th.speed
                } else {
                    // th.position.x = Math.round((th.position.x / Wall.size)) * Wall.size
                    th.position.x += ((Math.round((th.position.x / Wall.size)) * Wall.size) - th.position.x) / 10
                    mn.data.update("slots_change", v => v)
                }
            }
            static down = () => {
                let colistionBomb = th.checkBombColision
                th.position.y += th.speed
                let colistionBomb2 = th.checkBombColision
                th.moveAsistX = 10
                if (th.checkColision || (!colistionBomb && colistionBomb2)) {
                    th.position.y -= th.speed
                } else {
                    th.position.x += ((Math.round((th.position.x / Wall.size)) * Wall.size) - th.position.x) / 10
                    // th.position.x = Math.round((th.position.x / Wall.size)) * Wall.size
                    mn.data.update("slots_change", v => v)
                }
            }
        }
    }

    get playerCenter() {
        return { x: this.position.x + Player.width / 2, y: this.position.y + Player.height / 2 }
    }

    /**@param {Wall} obj */ //ou bomb
    objCenter(objCenter, size) {
        const playerPos = this.playerCenter
        return {
            x: Math.abs(playerPos.x - objCenter.x) - Player.width / 2 - size / 2,
            y: Math.abs(playerPos.y - objCenter.y) - Player.height / 2 - size / 2
        }
    }

    get checkColision() {

        for (const lineKey in this.game.wall_matrix) {
            const line = this.game.wall_matrix[lineKey];
            for (const wallKey in line) {
                const wall = line[wallKey];
                const playerDist = this.objCenter(wall.wallCenter, Wall.size)
                if (playerDist.x < -this.moveAsistX && playerDist.y < -this.moveAsistY) {
                    return true
                }
            }
        }
        return false
        return wall_matrix.some(line => {
            return line.some(wall => {
                const playerDist = this.objDist(wall)
                console.log(this.#moveAsist);
                return
            })
        })
    }
    get checkBombColision() {
        for (const bomb of this.game.bombs) {
            if (!bomb.active) continue
            const playerDist = this.objCenter(bomb.bombCenter, Bomb.size)
            if (playerDist.x < 0 && playerDist.y < 0) {
                return true
            }
        }
        return false
    }



    //bomb
    bombs = [
        new Bomb()
    ]

    poseBomb() {
        const bomb = Bomb.getFirstFreeBomb(this.bombs)
        if (bomb) {
            bomb.pose({ ...this.position })
        }
        // this.game.updateBombsList()
        
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