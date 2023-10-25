let timer = 0
let updat
let id_interval10
let id_interval20

function Start10() {
    clearInterval(id_interval20);
    clearInterval(id_interval10);
    timer = 10
    updat()
    id_interval10 = setInterval(()=>{
        console.log("inter10");
        timer--
        updat()
        if (timer <= 0) {clearInterval(id_interval10); if (!(socket && socket.connected)) {_startGame(); console.log("LOCAL GAME");}else{console.log("LAN GAME");}}
    }, 1000)
}
function Start20() {
    if (id_interval20) return
    clearInterval(id_interval20);
    clearInterval(id_interval10);
    timer = 20
    mn.data.update("chrono_" + id, _=> true)
    updat()
    id_interval20 = setInterval(()=>{
        timer--
        updat()
        if (timer <= 0) {
            clearInterval(id_interval20);
            Start10()
        }
    }, 1000)
}

const id = document.currentScript.getAttribute("chrono_id") || "default"
mn.data.set("chrono_" + id, false)
mn.insert(document.currentScript, (updater, old_element_updater) => {
    updat = updater
    mn.data.bind("chrono_" + id, updater)
    console.log(mn.data.get("chrono_" + id));
    if (!mn.data.get("chrono_" + id)) return []
    return [
        mn.element.create(
            "div",
            {
                id: "chrono_" + id,
                class: `chrono`,
                // src: player.status.ready?player.info.image:"./style/default_user_void.png",
                // style: `transform: translate(${bomb.position.x}px, ${bomb.position.y}px)`,
            },
            timer+""
        )
    ]
})