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
    size = 50
    static size = 50
    constructor(val, i_line, i_col) {
        this.type = (val === 1 ? "hardwall" : val === 2 ? "softwall" : "grass")
        this.position = {
            x: Wall.size * i_line,
            y: Wall.size * i_col,
        }
    }

    get center() {
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
    duration = 3 //second
    active_timestamp
    active = false
    position = { x: 0, y: 0 }
    size = 49
    static size = 49

    static getFirstFreeBomb(bombs) {
        return bombs.find((v) => {
            return !v.active
        }) || undefined
    }

    get center() {
        return { x: this.position.x + Wall.size / 2, y: this.position.y + Wall.size / 2 }
    }

    pose(player) {
        this.active_timestamp = Date.now()
        this.position = {
            x: Math.round((player.position.x / Wall.size)) * Wall.size,
            y: Math.round((player.position.y / Wall.size)) * Wall.size,
        }
        this.active = true
        console.log("C'est poser");
        setTimeout(() => {
            const rc_up = new RayCast(this.center, "x", player.range * Wall.size * 2, -1)
            const rc_down = new RayCast(this.center, "x", player.range * Wall.size * 2, 1)
            const rc_left = new RayCast(this.center, "y", player.range * Wall.size * 2, -1)
            const rc_right = new RayCast(this.center, "y", player.range * Wall.size * 2, 1)

            const funcDestroy = (objs) => {
                for (const obj of objs) {
                    obj.obj.position = { x: 0, y: 0 }
                }
                mn.data.update("wall", b => b)
            }
            rc_up.shoot([...game.wall_matrix.flat(), ...game.bombs,]).then(funcDestroy)
            rc_down.shoot([...game.wall_matrix.flat(), ...game.bombs,]).then(funcDestroy)
            rc_left.shoot([...game.wall_matrix.flat(), ...game.bombs,]).then(funcDestroy)
            rc_right.shoot([...game.wall_matrix.flat(), ...game.bombs,]).then(funcDestroy)
            // time loop ? timeout ?
            this.active = false
            mn.data.update("bombs", b => b)
        }, this.duration * 1000)
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

    size = 50
    static size = 50

    range = 1

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

    get center() {
        return { x: this.position.x + Player.size / 2, y: this.position.y + Player.size / 2 }
    }

    /**@param {Wall} obj */ //ou bomb
    objCenter(objCenter, size) {
        const playerPos = this.center
        return {
            x: Math.abs(playerPos.x - objCenter.x) - Player.size / 2 - size / 2,
            y: Math.abs(playerPos.y - objCenter.y) - Player.size / 2 - size / 2
        }
    }

    get checkColision() {

        for (const lineKey in this.game.wall_matrix) {
            const line = this.game.wall_matrix[lineKey];
            for (const wallKey in line) {
                const wall = line[wallKey];
                const playerDist = this.objCenter(wall.center, Wall.size)
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
            const playerDist = this.objCenter(bomb.center, Bomb.size)
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
            bomb.pose(this)
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

class RayCast {
    constructor(position, direction = "x", lenth = 1000, speed) {
        this.position = position
        this.direction = direction
        this.lenth = lenth
        this.speed = speed
        // this.handler = handler
    }
    speed = 1
    shoot(objs) {
        const th = this
        return new Promise(function (myResolve, myReject) {
            const promises = []

            for (const obj of objs) {
                promises.push(th.#collision(obj))
            }
            myResolve(promises.filter(v => v !== undefined))
            // myResolve(contactObjs); // when successful
            // myReject();  // when error
        });

    }

    #collision(obj) {
        let rc_pos = { ...this.position }
        const th = this
        const objCenter = obj.center
        const invertAxe = th.direction === "x" ? "y" : "x"
            const dist = {
                x: Math.abs(objCenter.x - rc_pos.x) - obj.size / 2,
                y: Math.abs(objCenter.y - rc_pos.y) - obj.size / 2
            }
            const dif = objCenter[th.direction] - th.position[th.direction]
            if ((Math.abs(dif) >= th.lenth) || th.speed < 0 && !(dif < 0) || th.speed >= 0 && !(dif >= 0) ||
                !(dist[invertAxe] < 0)) {
                return undefined
            }

            return {obj, dist}
            // myReject({});  // when error
    }
}

// const rc = new RayCast({x:225, y: 175}, "x", 4000, 1)

const game = new Game()