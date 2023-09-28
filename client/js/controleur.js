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
    static #gamepadsLastState = {}

    static GetStateGP(gamepad_id, iBt) {
        return this.#gamepads[gamepad_id].buttons[iBt].pressed
    }
    static GetLastStateGP(gamepad_id, iBt) {
        return this.#gamepadsLastState[gamepad_id].buttons[iBt].pressed
    }

    static LastStateGP(gamepad_id, iBt, val) {
        this.#gamepadsLastState[gamepad_id].buttons[iBt].pressed = val
    }

    static #listenGamepads = function () {
        const listener = () => {
            for (const key in this.#gamepads) {
                /** @type {Gamepad}*/
                const gamepad = this.#gamepads[key];
                /** @type {Gamepad}*/
                const gamepadLastState = this.#gamepadsLastState[key];

                if (gamepad.timestamp != gamepadLastState.timestamp) {
                    gamepad.buttons.forEach((bt, i) => {
                        gamepadLastState.buttons[i].pressed = bt.pressed
                    })
                }
            }
            requestAnimationFrame(listener)
        }
        requestAnimationFrame(listener)
    }
    //gamepad object init
    static initGamepadListener = () => {
        window.addEventListener("gamepadconnected", (e) => {
            console.log(e.gamepad);
            this.#gamepads[e.gamepad.id] = e.gamepad
            this.#gamepadsLastState[e.gamepad.id] = deepCopy(e.gamepad)
            console.log(this.#gamepadsLastState[e.gamepad.id]);
            if (Object.keys(this.#gamepads).length !== 1) return
            this.#listenGamepads()
        })
        window.addEventListener("gamepaddisconnected", (e) => {
            delete this.#gamepads[e.gamepad.id]
            delete this.#gamepadsLastState[e.gamepad.id]
        })
    }

    static #selectedControleur = "keyboard"
    static set selectedControleur(val) {
        if (val === "keyboard" || this.#gamepads[val] !== undefined) {
            this.#selectedControleur =  val
        }
    }

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
            if (this.GetStateGP(this.#selectedControleur, key)
                && !this.GetLastStateGP(this.#selectedControleur, key)) {
                func(...param); this.LastStateGP(this.#selectedControleur, key, true)
            }
        }
    }
    static onKeyUp(key, func, ...param) {
        if (this.#selectedControleur === "keyboard") {
            if (!this.#key[key] && this.#keyLastState[key]) { func(...param); this.#keyLastState[key] = false }
        } else {
            if (!this.GetStateGP(this.#selectedControleur, key)
                && this.GetLastStateGP(this.#selectedControleur, key)) {
                func(...param); this.LastStateGP(this.#selectedControleur, key, false)
            }
        }
    }
}

InputManager.initGamepadListener()


class Controleur {
    constructor() { }

    /**les object bien a modifier par les key bind*/
    #data = {}
    set data(data) {
        this.#data = data
    }

    /**le seting des touche et des handleur */
    #keybind = {

    }

    /**@type {Function} */
    set listenerSetup(func) {
        return func
    }

    set keybind(bind) {
        this.#keybind = bind
    }
}

InputManager.initKeyBoardListener()
const test = () => {
    InputManager.selectedControleur = "054c-09cc-Wireless Controller"
    InputManager.onKeyDown(0, () => { console.log("OnKeyDown") })
    InputManager.onKeyUp(0, () => { console.log("OnKeyUp") })
    InputManager.whileKeyDown(0, () => { console.log("WhilleKeyDown") })
    InputManager.whileKeyUp(0, () => { console.log("WhilleKeyup") })
    requestAnimationFrame(test)
}
test()

// basique actions
const up = function () { } //Player.move.up           //à définir
const down = function () { } //Player.move.down       //à définir
const left = function () { } //Player.move.left       //à définir
const right = function () { } //Player.move.right     //à définir
const pose = function () { } //Player.move.dropbomb  //à définir    


/**@type {Array<Controleur>} */
const constructors = [];

// AZERTY/QUERTY Keyboard controleur

const keyboard = new Controleur()

keyboard.keybind = {
    KeyW: up,
    KeyA: down,
    KeyS: left,
    KeyD: right,
    Space: pose,
};

keyboard.listenerSetup = () => {
    window.addEventListener("keydown")
}

constructors.push(keyboard)



// Arrow Keyboard controleur

const arrow = new Controleur()

arrow.keybind = {
    ArrowUp: up,
    ArrowDown: down,
    ArrowLeft: left,
    ArrowRight: right,
    ShiftRight: pose,
}

constructors.push(arrow)



// PS4 controleur

const ps4 = new Controleur()

ps4.keybind = {
    ps4Up: up, // je sais pas encore les key
    ps4Down: down, // je sais pas encore les key
    ps4Left: left, // je sais pas encore les key
    ps4Right: right, // je sais pas encore les key
    ShiftRight: pose, // je sais pas encore les key
}

//A PUSH SI MANETTE DETECTER
// constructors.push(ps4)




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
