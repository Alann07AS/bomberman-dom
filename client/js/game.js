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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
    [1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

// wall_matrix = [
//     [0, 0],
//     [0, 0],
//     [0, 0, 0],
// ]

class Bonus {
    static list = []
    static types = {
        speed: (player) => {
            player.speed += 1
        },
        bombnb: (player) => {
            player.bombs.push(new Bomb())
            mn.data.update("newbomb")
        },
        range: (player) => {
            player.range += 1
        }
    }
    static typeKeys = Object.keys(Bonus.types)
    static dropLuck = 0.3
    static size = 40
    static random(position) {
        return Bonus.dropLuck >= Math.random() ? new Bonus(position) : undefined
    }
    constructor(position) {

        this.type = Bonus.typeKeys[Math.trunc(Math.random() * Bonus.typeKeys.length)]
        console.log("this type", this.type);
        this.position = position
        Bonus.list.push(this)
        mn.data.update("bonus")
    }

    get center() {
        return { x: this.position.x + Wall.size / 2, y: this.position.y + Wall.size / 2 }
    }
    apply(player) {
        Bonus.types[this.type](player);
        const bI = Bonus.list.findIndex((v) => v === this);
        Bonus.list.splice(bI, 1);
        mn.data.update("bonus")
    }
}

class Wall {
    size = 50
    static size = 50
    constructor(val, i_line, i_col) {
        this.type = (val === 1 ? "hardwall" : (val === 2 && (Math.random() > 0.3)) ? "softwall" : "grass")
        this.position = {
            x: Wall.size * i_col,
            y: Wall.size * i_line,
        }
    }

    static destroy(wall) {
        const index = game.wall_matrix.findIndex(w => w.position.x === wall.position.x && w.position.y === wall.position.y)
        game.wall_matrix.splice(index, 1)
        mn.data.update("wall")
        Bonus.random({ ...wall.position })
    }

    get center() {
        return { x: this.position.x + Wall.size / 2, y: this.position.y + Wall.size / 2 }
    }
}

function SetWall_matrix(params) {
    wall_matrix = wall_matrix.map((v, i_line) => v.map((v2, i_col) => new Wall(v2, i_line, i_col)).filter(v => v.type !== "grass")).flat()
}
SetWall_matrix();

console.log(wall_matrix);


// wall_matrix.forEach(v=>console.log(...v))




const blasts = []

// BOMB 


class Bomb {
    constructor() {

    }
    sprite = "./style/sprites/bomb.png"
    duration = 3 //second
    blastDuration = 0.5
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

    blast(player = this.player) {
        const rc_up = new RayCast(this.center, "y", player.range * Wall.size, -1)
        const rc_down = new RayCast(this.center, "y", player.range * Wall.size, 1)
        const rc_left = new RayCast(this.center, "x", player.range * Wall.size, -1)
        const rc_right = new RayCast(this.center, "x", player.range * Wall.size, 1)

        const Pblasts = []
        blasts.push(Pblasts)
        setTimeout(() => { blasts.splice(blasts.findIndex(v => v === Pblasts), 1); mn.data.update("blasts") }, this.blastDuration * 1000)

        const funcHitPlayer = ([playersWall, axe, speed]) => {
            // console.log(playersWall);
            const walls =playersWall.filter(v=>v.obj instanceof Wall);
            const firstWall = walls.reduce((previous, curent) => {
                return previous.dist[axe] < curent.dist[axe] ? previous : curent
            }, walls[0])
            console.log(firstWall);
            const beforeWall = firstWall ? playersWall.filter(val => {console.log(val.obj, val.dist[axe], firstWall.dist[axe]);return val.dist[axe] < firstWall.dist[axe]}) : playersWall
            console.log(beforeWall);
            // const first = playersWall.reduce((previous, curent) => {
            // return previous.dist[axe] < curent.dist[axe] ? previous : curent
            // }, playersWall[0])

            for (const item of beforeWall) {
                //toucher un joueur
                if (item.obj instanceof Player) {
                    console.log("Player hit !", item.obj);
                    item.obj.dead = true
                    continue
                }

                //bombe toucher
                if (item.obj instanceof Bomb && item.obj !== this && item.obj.active) {
                    clearTimeout(item.obj.timeoutId)
                    item.obj.blast()
                    continue
                }

            }

            //si aucun mur toucher
            if (!firstWall) {
                console.log("PAS DE MUR TOUCHER");
                Pblasts.push({
                    sprite: "blast" + axe.toUpperCase(),
                    width: `${(axe !== "x") ? 50 : player.range * Wall.size}px`,
                    height: `${(axe !== "y") ? 50 : player.range * Wall.size}px`,
                    position: {
                        x: this.position.x + ((axe === "x" && speed >= 0) ? 50 : (axe === "x" && speed < 0) ? -(player.range * Wall.size) : 0),//wall.obj.position.x > this.position.x ? this.position.x + (wall.dist["x"] > 50 ? 50 : wall.dist["y"] > 0 ? 0 : 50) : wall.obj.position.x,
                        y: this.position.y + ((axe === "y" && speed >= 0) ? 50 : (axe === "y" && speed < 0) ? -(player.range * Wall.size) : 0),//wall.obj.position.y > this.position.y ? this.position.y + (wall.dist["y"] > 50 ? 50 : wall.dist["x"] > 0 ? 0 : 50) : wall.obj.position.y,
                    },
                })
                mn.data.update("blasts")
                return
            }

            //si toucher un mur dur
            if (firstWall.obj.type === "hardwall") {
                if (firstWall.dist[axe] < 50) {
                    return
                }
                Pblasts.push({
                    sprite: "blast" + axe.toUpperCase(),
                    width: `${((axe !== "x") ? 50 : firstWall.dist[axe] - 25)}px`,
                    height: `${((axe !== "y") ? 50 : firstWall.dist[axe] - 25)}px`,
                    position: {
                        x: (firstWall.obj.position.x > this.position.x ? this.position.x + (firstWall.dist["x"] > 50 ? 50 : (firstWall.dist["y"] > 0 ? 0 : 50)) : firstWall.obj.position.x + (axe === "x" ? 50 : 0)),
                        y: (firstWall.obj.position.y > this.position.y ? this.position.y + (firstWall.dist["y"] > 50 ? 50 : (firstWall.dist["x"] > 0 ? 0 : 50)) : firstWall.obj.position.y + (axe === "y" ? 50 : 0)),
                    },
                })
                mn.data.update("blasts")
                return
            }

            //si toucher un mur destructible
            if (firstWall.obj.type === "softwall") {
                Wall.destroy(firstWall.obj)
                Pblasts.push({
                    sprite: "blast" + axe.toUpperCase(),
                    width: `${(axe !== "x") ? 50 : firstWall.dist[axe] + 25}px`,
                    height: `${(axe !== "y") ? 50 : firstWall.dist[axe] + 25}px`,
                    position: {
                        x: firstWall.obj.position.x > this.position.x ? this.position.x + (firstWall.dist["x"] > 50 ? 50 : firstWall.dist["y"] > 0 ? 0 : 50) : firstWall.obj.position.x,
                        y: firstWall.obj.position.y > this.position.y ? this.position.y + (firstWall.dist["y"] > 50 ? 50 : firstWall.dist["x"] > 0 ? 0 : 50) : firstWall.obj.position.y,
                    },
                })
                mn.data.update("blasts")
            }
        }
        rc_up.shoot([...game.slots, ...game.wall_matrix, ...game.bombs]).then(funcHitPlayer)
        rc_down.shoot([...game.slots, ...game.wall_matrix, ...game.bombs]).then(funcHitPlayer)
        rc_left.shoot([...game.slots, ...game.wall_matrix, ...game.bombs]).then(funcHitPlayer)
        rc_right.shoot([...game.slots, ...game.wall_matrix, ...game.bombs]).then(funcHitPlayer)


        const funcHitBomb = ([bombs, axe]) => {
            for (const bomb of bombs) {
                if (bomb.obj !== this && bomb.obj.active) {
                    // clearTimeout(bomb.obj.timeoutId)
                    // bomb.obj.blast()
                }
            }
        }
        rc_up.shoot(game.bombs).then(funcHitBomb)
        rc_down.shoot(game.bombs).then(funcHitBomb)
        rc_left.shoot(game.bombs).then(funcHitBomb)
        rc_right.shoot(game.bombs).then(funcHitBomb)

        this.active = false
        mn.data.update("bombs", b => b)
        Pblasts.push({
            sprite: "blastMidle",
            width: `50px`,
            height: `50px`,
            position: this.position,
        })
        mn.data.update("blasts")
    }

    pose(player) {
        this.player = player
        this.active_timestamp = Date.now()
        this.position = {
            x: Math.round((player.position.x / Wall.size)) * Wall.size,
            y: Math.round((player.position.y / Wall.size)) * Wall.size,
        }
        this.active = true
        console.log("C'est poser");
        this.timeoutId = setTimeout(() => (this.blast()), this.duration * 1000)
        mn.data.update("bombs", b => b)
    }

}


class Game {
    constructor() {
        this.updateBombsList()
    }

    slots = [
        new Player(this, "./style/sprites/black.png", { x: Wall.size * 11, y: Wall.size * 11 }),
        new Player(this, "./style/sprites/white.png", { x: Wall.size * 1, y: Wall.size * 1 }),
        new Player(this, "./style/sprites/red.png", { x: Wall.size * 11, y: Wall.size * 1 }),
        new Player(this, "./style/sprites/blue.png", { x: Wall.size * 1, y: Wall.size * 11 }),
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

    range = 2

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
    speed = 3//1.4
    dead = false
    position = { x: 0, y: 0 }
    get move() {
        const th = this
        const b = this.checkBonusColision;
        if (b) {
            console.log(b);
            b.apply(this)
        }
        return class {
            static left = () => {
                if (th.dead) return
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
                if (th.dead) return
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
                if (th.dead) return
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
                if (th.dead) return
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

        for (const wallKey in this.game.wall_matrix) {
            const wall = this.game.wall_matrix[wallKey];
            const playerDist = this.objCenter(wall.center, Wall.size)
            if (playerDist.x < -this.moveAsistX && playerDist.y < -this.moveAsistY) {
                return true
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
    get checkBonusColision() {
        for (const bonus of Bonus.list) {
            const playerDist = this.objCenter(bonus.center, Bonus.size)
            if (playerDist.x < 0 && playerDist.y < 0) {
                return bonus
            }
        }
        return false
    }



    //bomb
    bombs = [
        new Bomb(),
    ]

    poseBomb() {
        const bomb = Bomb.getFirstFreeBomb(this.bombs)
        if (bomb) {
            bomb.pose(this)
        }
        this.game.updateBombsList()

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

            for (const objKey in objs) {
                promises.push(th.#collision(objs[objKey]))
            }
            myResolve([promises.filter(v => v !== undefined), th.direction, th.speed])
            // myResolve(contactObjs); // when successful
            // myReject();  // when error
        });

    }

    #collision(obj) {
        const th = this
        const objCenter = obj.center
        const invertAxe = th.direction === "x" ? "y" : "x"
        const dist = {
            x: Math.abs(objCenter.x - this.position.x) - obj.size / 2,
            y: Math.abs(objCenter.y - this.position.y) - obj.size / 2
        }
        const dif = objCenter[th.direction] - th.position[th.direction]
        if ((Math.abs(dist[th.direction]) > th.lenth) || th.speed <= 0 && !(dif <= 0) || th.speed >= 0 && !(dif >= 0) ||
            !(dist[invertAxe] < 0)) {
            return undefined
        }
        return { obj, dist }
        // myReject({});  // when error
    }
}

// const rc = new RayCast({x:175, y: 175}, "x", 100, 1)
const game = new Game()
// rc.shoot(game.wall_matrix.flat()).then(objs=>objs.forEach(element => {
//   element.obj.position = {x:0, y:0}
//   mn.data.update("wall", w=>w)  
// }))