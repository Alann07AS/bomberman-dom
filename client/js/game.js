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
            player.speed += 0.3
        },
        bombnb: (player) => {
            player.bombs.push(new Bomb())
            mn.data.update("newbomb")
            mn.data.update("update_player", _ => game.slots.findIndex(v => v === player))
        },
        range: (player) => {
            player.range += 1
            mn.data.update("update_player", _ => game.slots.findIndex(v => v === player))
        }
    }
    static typeKeys = Object.keys(Bonus.types)
    static dropLuck = 0.3
    static size = 40
    size = 40
    static random(position) {
        return Bonus.dropLuck >= Math.random() ? new Bonus(position) : undefined
    }
    constructor(position, type, local = true) {
        type = type!==undefined?type:Math.trunc(Math.random() * Bonus.typeKeys.length)
        this.type = Bonus.typeKeys[type]
        this.position = position
        Bonus.list.push(this)
        mn.data.update("bonus")
        if (socket && socket.connected && local) { //dans le cas d'une partie en ligne
            socket.emit("bonus", position.x, position.y, type)
        }
    }

    get center() {
        return { x: this.position.x + Wall.size / 2, y: this.position.y + Wall.size / 2 }
    }
    apply(player) {
        Bonus.types[this.type](player);
        this.destroy()
    }
    destroy() {
        const bI = Bonus.list.findIndex((v) => v === this);
        Bonus.list.splice(bI, 1);
        mn.data.update("bonus")
    }
}

class Wall {
    size = 50
    isDestroy = false
    static size = 50
    constructor(val, i_line, i_col) {
        this.type = (val === 1 ? "hardwall" : ((val === 3) || (val === 2 && (Math.random() > 0.3))) ? "softwall" : "grass")
        this.position = {
            x: Wall.size * i_col,
            y: Wall.size * i_line,
        }
    }

    static destroy(wall, withBonus = true) {
        if (wall.type != "softwall") return
        wall.isDestroy = true
        mn.data.update("walldestroy")
        setTimeout(() => {
            const index = game.wall_matrix.findIndex(w => w.position.x === wall.position.x && w.position.y === wall.position.y)
            game.wall_matrix.splice(index, 1)
            mn.data.update("wall")
            if (withBonus) Bonus.random({ ...wall.position })
        }, 500)

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
    constructor() { }
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
        let isBlast = true

        // timeout to cancelled blast
        setTimeout(() => {
            blasts.splice(blasts.findIndex(v => v === Pblasts), 1);
            isBlast = false
            mn.data.update("blasts");
        }, this.blastDuration * 1000)

        const funcHitPlayerWallAndBomb = ([playersWall, axe, speed]) => {
            // get all wall and first wall
            const walls = playersWall.filter(v => v.obj instanceof Wall);
            const firstWall = walls.reduce((previous, curent) => {
                return previous.dist[axe] < curent.dist[axe] ? previous : curent
            }, walls[0])

            //get elemnt front of the first wall (all if no wall)
            const beforeWall = firstWall ? playersWall.filter(val => val.dist[axe] < firstWall.dist[axe]) : playersWall

            const hadleBombPlayer = (beforeWall) => {
                for (const item of beforeWall) {
                    //toucher un joueur
                    if (item.obj instanceof Player) {
                        // console.log("Player hit !", item.obj);
                        if (!item.obj.invinsible) {
                            if (item.obj.controleur) {
                                const id = game.slots.findIndex(v => v === item.obj)
                                item.obj.pv -= 1
                                if (socket && socket.connected) { // dans le cas d'une partie en ligne
                                    socket.emit("pv", item.obj.pv, id)
                                }
                                mn.data.update("update_player", _ => id)
                            }
                            item.obj.invinsible = true
                            setTimeout(() => {
                                item.obj.invinsible = false
                                mn.data.update("slots_change", p => p)
                            }, 2500)
                            mn.data.update("slots_change", p => p)
                        }
                        continue
                    }

                    //bombe toucher
                    if (item.obj instanceof Bomb && item.obj !== this && item.obj.active) {
                        clearTimeout(item.obj.timeoutId)
                        item.obj.blast()
                        continue
                    }

                    //bonus toucher
                    if (item.obj instanceof Bonus) {
                        item.obj.destroy()
                        continue
                    }
                }
            }
            hadleBombPlayer(beforeWall)

            // tire le raycast pendant toute la durer du blast
            const range = (firstWall ? firstWall.dist[axe] : Math.abs(player.range * Wall.size))
            const rc_blast = new RayCast(this.center, axe, range, speed)
            // console.log(rc_blast);
            const funcHitPlayerAfterBlast = ([item, axe, speed]) => {
                if (!isBlast) return // stop if blast done
                hadleBombPlayer(item)
                //check again
                requestAnimationFrame(() => {
                    rc_blast.shoot([...game.slots]).then(funcHitPlayerAfterBlast)
                })
            }
            rc_blast.shoot([...game.slots]).then(funcHitPlayerAfterBlast)

            //si aucun mur toucher
            if (!firstWall) {
                // console.log("PAS DE MUR TOUCHER");
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
            if (!(firstWall.dist[axe] < 50)) {
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
            }


            //si toucher un mur destructible
            if (firstWall.obj.type === "softwall") {
                Wall.destroy(firstWall.obj, this.withBonus)
                mn.data.update("blasts")
            }
        }

        rc_up.shoot([...game.slots, ...game.wall_matrix, ...game.bombs, ...Bonus.list]).then(funcHitPlayerWallAndBomb)
        rc_down.shoot([...game.slots, ...game.wall_matrix, ...game.bombs, ...Bonus.list]).then(funcHitPlayerWallAndBomb)
        rc_left.shoot([...game.slots, ...game.wall_matrix, ...game.bombs, ...Bonus.list]).then(funcHitPlayerWallAndBomb)
        rc_right.shoot([...game.slots, ...game.wall_matrix, ...game.bombs, ...Bonus.list]).then(funcHitPlayerWallAndBomb)

        // midlle blast
        Pblasts.push({
            sprite: "blastMidle",
            width: `50px`,
            height: `50px`,
            position: this.position,
        })
        mn.data.update("blasts")
        this.active = false
        mn.data.update("bombs", b => b)
    }

    pose(player, timestamp, withBonus = true) {
        this.player = player
        this.withBonus = withBonus
        this.active_timestamp = Date.now()
        this.position = {
            x: Math.round((player.position.x / Wall.size)) * Wall.size,
            y: Math.round((player.position.y / Wall.size)) * Wall.size,
        }
        this.active = true
        const det = Date.now()
        this.timeoutId = setTimeout(() => { this.blast(); console.log(Date.now() - det) }, ((this.duration * 1000) - (timestamp ? this.active_timestamp - timestamp : 0)))
        mn.data.update("bombs", b => b)
    }

}


class Game {
    constructor() {
        this.updateBombsList()
    }

    status = false

    slots = [
        new Player(0, this, "./style/sprites/black.png", { x: Wall.size * 11, y: Wall.size * 11 }),
        new Player(1, this, "./style/sprites/white.png", { x: Wall.size * 1, y: Wall.size * 1 }),
        new Player(2, this, "./style/sprites/red.png", { x: Wall.size * 11, y: Wall.size * 1 }),
        new Player(3, this, "./style/sprites/blue.png", { x: Wall.size * 1, y: Wall.size * 11 }),
    ]

    set wall_matrix(wm) {
        wall_matrix = wm
        SetWall_matrix()
        this.#wall_matrix = wall_matrix
    }
    get wall_matrix() {
        return this.#wall_matrix
    }
    #wall_matrix = [...wall_matrix]
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
    constructor(id, game, avatar, position) {
        this.id = id
        this.game = game
        this.info.image = avatar
        this.position = position
    }

    invinsible = false
    pv = 3
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
    dead = false
    position = { x: 0, y: 0 }
    updateposition = (x, y) => {
        this.position.x = x
        this.position.y = y
    }
    get move() {
        const th = this
        const b = this.checkBonusColision;
        if (b) {
            b.apply(this)
        }
        const only = () => {
            if (socket && socket.connected) { // dans le cas d'une partie en ligne  
                socket.emit("playerpos", th.id, th.position.x, th.position.y)
            }
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
                only()
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
                only()
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
                only()
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
                only()
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
            if (socket && socket.connected) { //dans le cas d'une partie en ligne
                socket.emit("bomb", this.id, this.bombs.findIndex(b => b === bomb), bomb.active_timestamp)
            }
            this.game.updateBombsList()
        }
    }
    poseBombId(id, active_timestamp) {
        const bomb = this.bombs[id]
        if (bomb) {
            bomb.pose(this, active_timestamp, false)
            this.game.updateBombsList()
        }
    }


    /**
     * @param {Controleur} controleur 
     * @param {*} manquedestrucla 
     */
    bind(controleur, manquedestrucla) {
        if (this.game.status) return //ne rejoint pas si partie demarer
        this.status.ready = true;
        controleur.data = this;
        this.controleur = controleur;
        mn.data.update("slots_change")
        mn.data.update("update_player", _ => this.id)
        if (socket && socket.connected) { // dans le cas d'une partie en ligne
            socket.emit("addplayer", this.socketFormat())
        }
    }
    //SOCKET PART
    socketFormat() {
        return {
            id: this.id,
            position: this.position,
            status: this.status,
            range: this.range,
            // bombs: new Array(this.bombs.length),
            pv: this.pv,
            invinsible: this.invinsible,
        }
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