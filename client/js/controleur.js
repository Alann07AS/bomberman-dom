setTimeout()
class InputManager {
    //Const ->
    static get RightArrow() { return 'ArrowRight' }
    static get LeftArrow() { return 'ArrowLeft' }
    static get UpArrow() { return 'ArrowUp' }
    static get DownArrow() { return 'ArrowDown' }
    static get Space() { return ' ' }
    static get Escape() { return 'Escape' }

    //keyboard object init
    static initKeyBoardListener = () => {
        document.addEventListener('keydown', (k) => {
            if (this.keyMap[k.code] != true) this.keyMapLastState[k.code] = false
            this.keyMap[k.code] = true
        })
        document.addEventListener('keyup', (k) => {
            if (this.keyMap[k.code] != false) this.keyMapLastState[k.code] = true
            this.keyMap[k.code] = false
        })
    }

    //gamepad object init
    static initGamepadListener = () => {
        document.addEventListener('keydown', (k) => {
            if (this.keyMap[k.code] != true) this.keyMapLastState[k.code] = false
            this.keyMap[k.code] = true
        })
        document.addEventListener('keyup', (k) => {
            if (this.keyMap[k.code] != false) this.keyMapLastState[k.code] = true
            this.keyMap[k.code] = false
        })
    }

    //Key Listener and map save
    static keyMap = new Map
    static keyMapLastState = new Map

    // KeyManager Methode
    static whileKeyDown(key, func, ...param) {
        if (this.keyMap[key]) func(...param)
    }
    static whileKeyUp(key, func, ...param) {
        if (!this.keyMap[key]) func(...param)
    }
    static onKeyDown(key, func, ...param) {
        if (this.keyMap[key] && !this.keyMapLastState[key]) { func(...param); this.keyMapLastState[key] = true }
    }
    static onKeyUp(key, func, ...param) {
        if (!this.keyMap[key] && this.keyMapLastState[key]) { func(...param); this.keyMapLastState[key] = false }
    }
}

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

const test = () => {
    KeyManager.onKeyDown(" ", () => { console.log("OnKeyDown") })
    // KeyManager.onKeyUp(" ", ()=>{console.log("OnKeyUp")})
    // KeyManager.whileKeyDown(" ", ()=>{console.log("WhilleKeyDown")})
    // KeyManager.whileKeyUp(" ", ()=>{console.log("WhilleKeyup")})
    // requestAnimationFrame(test)
}
setInterval(test, 1000)

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




const haveEvents = "ongamepadconnected" in window;
console.log(haveEvents);
const controllers = {};

function connecthandler(e) {
    console.log("COUCOU CONTROLEUR", e.gamepad);
    addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad;

    const d = document.createElement("div");
    d.setAttribute("id", `controller${gamepad.index}`);

    const t = document.createElement("h1");
    t.textContent = `gamepad: ${gamepad.id}`;
    d.appendChild(t);

    const b = document.createElement("ul");
    b.className = "buttons";
    gamepad.buttons.forEach((button, i) => {
        const e = document.createElement("li");
        e.className = "button";
        e.textContent = `Button ${i}`;
        b.appendChild(e);
    });

    d.appendChild(b);

    const a = document.createElement("div");
    a.className = "axes";

    gamepad.axes.forEach((axis, i) => {
        const p = document.createElement("progress");
        p.className = "axis";
        p.setAttribute("max", "2");
        p.setAttribute("value", "1");
        p.textContent = i;
        a.appendChild(p);
    });

    d.appendChild(a);

    // See https://github.com/luser/gamepadtest/blob/master/index.html
    const start = document.getElementById("start");
    if (start) {
        start.style.display = "none";
    }

    document.body.appendChild(d);
    requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    const d = document.getElementById(`controller${gamepad.index}`);
    document.body.removeChild(d);
    delete controllers[gamepad.index];
}

function updateStatus() {
    if (!haveEvents) {
        scangamepads();
    }
    Object.entries(controllers).forEach(([i, controller]) => {
        console.clear()
        const d = document.getElementById(`controller${i}`);
        const buttons = d.getElementsByClassName("button");

        controller.buttons.forEach((button, i) => {
            const b = buttons[i];
            let pressed = button === 1.0;
            let val = button;

            if (typeof button === "object") {
                pressed = val.pressed;
                val = val.value;
                // console.log("hello");
            }
            const pct = `${Math.round(val * 100)}%`;
            b.style.backgroundSize = `${pct} ${pct}`;
            b.textContent = pressed ? `Button ${i} [PRESSED]` : `Button ${i}`;
            b.style.color = pressed ? "#42f593" : "#2e2d33";
            b.className = pressed ? "button pressed" : "button";
        });
        console.log(controller.buttons[7]);

        const axes = d.getElementsByClassName("axis");
        controller.axes.forEach((axis, i) => {
            const a = axes[i];
            a.textContent = `${i}: ${axis.toFixed(4)}`;
            a.setAttribute("value", axis + 1);
        });
    });
    requestAnimationFrame(updateStatus);
}

function scangamepads() {
    const gamepads = navigator.getGamepads();
    // document.querySelector("#noDevices").style.display = gamepads.filter(Boolean)
    //     .length
    //     ? "none"
    //     : "block";
    for (const gamepad of gamepads) {
        if (gamepad) {
            // Can be null if disconnected during the session
            if (gamepad.index in controllers) {
                controllers[gamepad.index] = gamepad;
            } else {
                addgamepad(gamepad);
            }
        }
    }
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
    setInterval(scangamepads, 1000);
}
