const deepCopy = (obj) => {
    console.log(typeof obj);
    const newObj = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
        newObj[key] =
            typeof obj[key] === "object" ?
                deepCopy(obj[key]) :
                obj[key]
    }
    return typeof obj !== "object" ?
        obj : newObj
}
class InputManager {
    //Const ->
    static get RightArrow() { return 'ArrowRight' }
    static get LeftArrow() { return 'ArrowLeft' }
    static get UpArrow() { return 'ArrowUp' }
    static get DownArrow() { return 'ArrowDown' }
    static get Space() { return 'Space' }
    static get Escape() { return 'Escape' }


    //Key Listener and map save
    static #key = {}
    static #keyLastState = {}

    //keyboard object init
    static initKeyBoardListener = () => {
        document.addEventListener('keydown', (k) => {
            // if (this.#key[k.code] != true) this.#keyLastState[k.code] = false
            this.#keyLastState[k.code] = this.#key[k.code]
            this.#key[k.code] = true
        })
        document.addEventListener('keyup', (k) => {
            // if (this.#key[k.code] != false) this.#keyLastState[k.code] = true
            this.#keyLastState[k.code] = this.#key[k.code]
            this.#key[k.code] = false
        })
    }

    //the connected gamepad
    static #gamepads = {}
    static get gamepads() {
        return this.#gamepads
    }
    static #gamepadsLastState = {}

    static GetStateGP(gamepad_id, iBt) {
        switch (iBt) {
            case "up": return this.#gamepads[gamepad_id].axes[7] === -1
            case "down": return this.#gamepads[gamepad_id].axes[7] === 1
            case "left": return this.#gamepads[gamepad_id].axes[6] === -1
            case "right": return this.#gamepads[gamepad_id].axes[6] === 1
            default: return this.#gamepads[gamepad_id].buttons[iBt].pressed
        }
    }
    static GetLastStateGP(gamepad_id, iBt) {
        switch (iBt) {
            case "up": return this.#gamepadsLastState[gamepad_id].axes[7] === -1
            case "down": return this.#gamepadsLastState[gamepad_id].axes[7] === 1
            case "left": return this.#gamepadsLastState[gamepad_id].axes[6] === -1
            case "right": return this.#gamepadsLastState[gamepad_id].axes[6] === 1
            default: return this.#gamepadsLastState[gamepad_id].buttons[iBt].pressed
        }
    }

    static LastStateGP(gamepad_id, iBt, val) {
        //pas utiliser ? mise a jour inutile pour gamepad
        switch (iBt) {
            case "up": this.#gamepadsLastState[gamepad_id].axes[7] = val; return
            case "down": this.#gamepadsLastState[gamepad_id].axes[7] = val; return
            case "left": this.#gamepadsLastState[gamepad_id].axes[6] = val; return
            case "right": this.#gamepadsLastState[gamepad_id].axes[6] = val; return
            default: this.#gamepadsLastState[gamepad_id].buttons[iBt].pressed = val
        }
    }


    static #isListen = false
    static #listenGamepads = function () {
        const listener = () => {
            // console.log(this.#gamepads);
            for (const key in this.#gamepads) {
                /** @type {Gamepad}*/
                const gamepad = this.#gamepads[key];
                /** @type {Gamepad}*/
                const gamepadLastState = this.#gamepadsLastState[key];
                if (gamepad.timestamp !== gamepadLastState.timestamp) {
                    gamepadLastState.timestamp = gamepad.timestamp
                    gamepad.buttons.forEach((bt, i) => {
                        gamepadLastState.buttons[i].pressed = bt.pressed
                    })
                    for (let i = 6; i < 8; i++) {
                        gamepadLastState.axes[i] = gamepad.axes[i]
                    }
                }
            }
            if (this.#isListen) {
                requestAnimationFrame(listener)
            }
        }
        this.#isListen = false
        setTimeout(() => { this.#isListen = true; requestAnimationFrame(listener) }, 100)

    }
    //gamepad object init
    static initGamepadListener = () => {
        window.addEventListener("gamepadconnected", (e) => {
            this.#gamepads[e.gamepad.id] = e.gamepad
            this.#gamepadsLastState[e.gamepad.id] = deepCopy(e.gamepad)
            if (Object.keys(this.#gamepads).length < 1) return
            // new Controleur("{PS4}", ps4_keybind, e.gamepad.id)
            this.#listenGamepads()
            console.log(this.#gamepads);
        })
        window.addEventListener("gamepaddisconnected", (e) => {
            delete this.#gamepads[e.gamepad.id]
            delete this.#gamepadsLastState[e.gamepad.id]
        })
    }

    static #selectedControleur = "keyboard"
    static set selectedControleur(val) {
        if (val === "keyboard" || this.#gamepads[val] !== undefined) {
            this.#selectedControleur = val
        }
    }
    static get selectedControleur() { return this.#selectedControleur }

    // InputManager Methode
    static whileKeyDown(key, func, ...param) {
        if (this.#selectedControleur === "keyboard") {
            if (this.#key[key]) func(...param)
        } else {
            if (this.GetStateGP(this.#selectedControleur, key)) func(...param)
        }
    }
    static whileKeyUp(key, func, ...param) {
        if (this.#selectedControleur === "keyboard") {
            if (!this.#key[key]) func(...param)
        } else {
            if (!this.GetStateGP(this.#selectedControleur, key)) func(...param)
        }
    }
    static onKeyDown(key, func, ...param) {
        if (this.#selectedControleur === "keyboard") {
            if (this.#key[key] && !this.#keyLastState[key]) { func(...param); this.#keyLastState[key] = true }
        } else {
            // console.log("HELLO", this.GetStateGP(this.#selectedControleur, key)
            // , !this.GetLastStateGP(this.#selectedControleur, key));
            if (this.GetStateGP(this.#selectedControleur, key)
                && !this.GetLastStateGP(this.#selectedControleur, key)) {
                func(...param);// this.LastStateGP(this.#selectedControleur, key, true)
            }
        }
    }
    static onKeyUp(key, func, ...param) {
        if (this.#selectedControleur === "keyboard") {
            if (!this.#key[key] && this.#keyLastState[key]) { func(...param); this.#keyLastState[key] = false }
        } else {
            if (!this.GetStateGP(this.#selectedControleur, key)
                && this.GetLastStateGP(this.#selectedControleur, key)) {
                func(...param);// this.LastStateGP(this.#selectedControleur, key, false)
            }
        }
    }
}

InputManager.initGamepadListener()
InputManager.initKeyBoardListener()
const test = () => {
    InputManager.selectedControleur = "054c-09cc-Wireless Controller"
    InputManager.onKeyDown(0, () => { console.log("La Mannette: OnKeyDown") })
    InputManager.onKeyUp(0, () => { console.log("La Mannette: OnKeyUp") })

    // InputManager.selectedControleur = "keyboard"
    // InputManager.onKeyDown("Space", () => { console.log("Le Clavier ZQSD: OnKeyDown") })
    // InputManager.onKeyUp("Space", () => { console.log("Le Clavier ZQSD: OnKeyUp") })
    // 
    // InputManager.onKeyDown(InputManager.UpArrow, () => { console.log("Le Clavier fleche: OnKeyDown") })
    // InputManager.onKeyUp(InputManager.UpArrow, () => { console.log("Le Clavier fleche: OnKeyUp") })

    // InputManager.whileKeyDown(0, () => { console.log("WhilleKeyDown") })
    // InputManager.whileKeyUp(0, () => { console.log("WhilleKeyup") })
    requestAnimationFrame(test)
}
// setTimeout(test, 2000)

class Controleur {
    constructor(data, keybind, id = "keyboard") {
        this.id = id
        this.data = data
        this.keybind = keybind
        const listener = () => {
            if (this.id === "keyboard") {
                InputManager.selectedControleur = "keyboard"
            } else {
                InputManager.selectedControleur = this.id
            }
            this.keybind.forEach((/**@type {keyBind}*/key) => {
                InputManager[key.inputType](key.key, key.func, this.#data)
            })
            requestAnimationFrame(listener)
        }
        listener()
    }

    /**les object bien a modifier par les key bind*/
    #data = {}
    set data(data) {
        this.#data = data
    }

    /**le seting des touche et des handleur */
    #keybind = []
    set keybind(bind) {
        this.#keybind = bind
    }
    get keybind() {
        return this.#keybind
    }

}

class keyBind {
    /**
     * 
     * @param {string} key 
     * @param {InputManager} inputType 
     * @param {Function} func 
     */
    constructor(key, inputType, func) {
        this.key = key
        this.inputType = inputType
        this.func = func
    }
}

// basique actions
// const join = Player.move.join //function (data) { console.log(data + "JoinSlot"); } //Player.move.up           //à définir
const up = (data)=>{if (!data) return; data.move.up()} //function (data) { console.log(data + "up"); } //Player.move.up           //à définir
const down = (data)=>{if (!data) return; data.move.down()} //function (data) { console.log(data + "down"); } //Player.move.down       //à définir
const left = (data)=>{if (!data) return; data.move.left()} //function (data) { console.log(data + "left"); } //Player.move.left       //à définir
const right = (data)=>{if (!data) return; data.move.right()} //function (data) { console.log(data + "right"); } //Player.move.right     //à définir
const pose = (data)=>{if (!data) return; data.move.pose()} //function (data) { console.log(data + "pose"); } //Player.move.dropbomb  //à définir    

/**@type {Array<Controleur>} */
const controlors = [];

// AZERTY/QUERTY Keyboard controleur

const keyboard_keybind = [
    new keyBind("KeyW", "whileKeyDown", up),
    new keyBind("KeyA", "whileKeyDown", left),
    new keyBind("KeyS", "whileKeyDown", down),
    new keyBind("KeyD", "whileKeyDown", right),
    new keyBind("Space", "onKeyDown", pose),
];

// Arrow Keyboard controleur

const keyboard_arrow_keybind = [
    new keyBind("ArrowUp", "whileKeyDown", up),
    new keyBind("ArrowLeft", "whileKeyDown", left),
    new keyBind("ArrowDown", "whileKeyDown", down),
    new keyBind("ArrowRight", "whileKeyDown", right),
    new keyBind("ShiftRight", "onKeyDown", pose),
];

const zqsds = keyboard_keybind.map(v=>v.key)

window.addEventListener("keydown", function f(e) {
    if (zqsds.find(v=>v===e.code)) {
        const keyboard = new Controleur(undefined, keyboard_keybind,)
        game.getFirstFreeSlot().bind(keyboard)
        window.removeEventListener("keydown", f)
    }
})

const arrows = keyboard_arrow_keybind.map(v=>v.key)
window.addEventListener("keydown", function f(e) {
    if (arrows.find(v=>v===e.code)) {
        const arrow = new Controleur(undefined, keyboard_arrow_keybind)
        game.getFirstFreeSlot().bind(arrow)
        window.removeEventListener("keydown", f)
    }
})

// PS4 controleur

const ps4_keybind = [
    new keyBind("up", "whileKeyDown", up),
    new keyBind("left", "whileKeyDown", left),
    new keyBind("down", "whileKeyDown", down),
    new keyBind("right", "whileKeyDown", right),
    new keyBind(0, "onKeyDown", pose),
];

window.addEventListener("gamepadconnected", (e) => {
    const ps4 = new Controleur(undefined, ps4_keybind, e.gamepad.id)//"054c-09cc-Wireless Controller")
    console.log(ps4);
    game.getFirstFreeSlot().bind(ps4)
})










// const haveEvents = "ongamepadconnected" in window;
// console.log(haveEvents);
// const controllers = {};

// function connecthandler(e) {
//     /**@type {Gamepad} */
//     const gamepad = e.gamepad
//     console.log("COUCOU CONTROLEUR", gamepad.timestamp);
//     // gamepad.vibrationActuator
//     console.log(e.gamepad.buttons[0]);
//     addgamepad(e.gamepad);
// }

// function addgamepad(gamepad) {
//     controllers[gamepad.index] = gamepad;

//     const d = document.createElement("div");
//     d.setAttribute("id", `controller${gamepad.index}`);

//     const t = document.createElement("h1");
//     t.textContent = `gamepad: ${gamepad.id}`;
//     d.appendChild(t);

//     const b = document.createElement("ul");
//     b.className = "buttons";
//     gamepad.buttons.forEach((button, i) => {
//         const e = document.createElement("li");
//         e.className = "button";
//         e.textContent = `Button ${i}`;
//         b.appendChild(e);
//     });

//     d.appendChild(b);

//     const a = document.createElement("div");
//     a.className = "axes";

//     gamepad.axes.forEach((axis, i) => {
//         const p = document.createElement("progress");
//         p.className = "axis";
//         p.setAttribute("max", "2");
//         p.setAttribute("value", "1");
//         p.textContent = i;
//         a.appendChild(p);
//     });

//     d.appendChild(a);

//     // See https://github.com/luser/gamepadtest/blob/master/index.html
//     const start = document.getElementById("start");
//     if (start) {
//         start.style.display = "none";
//     }

//     document.body.appendChild(d);
//     requestAnimationFrame(updateStatus);
// }

// function disconnecthandler(e) {
//     removegamepad(e.gamepad);
// }

// function removegamepad(gamepad) {
//     const d = document.getElementById(`controller${gamepad.index}`);
//     document.body.removeChild(d);
//     delete controllers[gamepad.index];
// }

// function updateStatus() {
//     if (!haveEvents) {
//         scangamepads();
//     }

//     Object.entries(controllers).forEach(([i, controller]) => {
//         // console.log(controller.timestamp);
//         const d = document.getElementById(`controller${i}`);
//         const buttons = d.getElementsByClassName("button");

//         controller.buttons.forEach((button, i) => {
//             const b = buttons[i];
//             let pressed = button === 1.0;
//             let val = button;

//             if (typeof button === "object") {
//                 pressed = val.pressed;
//                 val = val.value;
//                 // console.log("hello");
//             }
//             const pct = `${Math.round(val * 100)}%`;
//             b.style.backgroundSize = `${pct} ${pct}`;
//             b.textContent = pressed ? `Button ${i} [PRESSED]` : `Button ${i}`;
//             b.style.color = pressed ? "#42f593" : "#2e2d33";
//             b.className = pressed ? "button pressed" : "button";
//         });

//         const axes = d.getElementsByClassName("axis");
//         controller.axes.forEach((axis, i) => {
//             const a = axes[i];
//             a.textContent = `${i}: ${axis.toFixed(4)}`;
//             a.setAttribute("value", axis + 1);
//         });
//     });
//     requestAnimationFrame(updateStatus);
// }

// function scangamepads() {
//     const gamepads = navigator.getGamepads();
//     // document.querySelector("#noDevices").style.display = gamepads.filter(Boolean)
//     //     .length
//     //     ? "none"
//     //     : "block";
//     for (const gamepad of gamepads) {
//         if (gamepad) {
//             // Can be null if disconnected during the session
//             if (gamepad.index in controllers) {
//                 controllers[gamepad.index] = gamepad;
//             } else {
//                 addgamepad(gamepad);
//             }
//         }
//     }
// }

// window.addEventListener("gamepadconnected", connecthandler);
// window.addEventListener("gamepaddisconnected", disconnecthandler);

// if (!haveEvents) {
//     setInterval(scangamepads, 1000);
// }
