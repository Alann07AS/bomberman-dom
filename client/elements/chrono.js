let timer = 0
let updat
function Start10() {
    timer = 10
    updat()
    const id_interval = setInterval(()=>{
        timer--
        updat()
        if (timer <= 0) {clearInterval(id_interval); if (!(socket && socket.connected)) {_startGame(); console.log("LOCAL GAME");}else{console.log("LAN GAME");}}
    }, 1000)
}
function Start20() {
    mn.data.update("chrono_" + id, _=> true)
    timer = 5
    updat()
    const id_interval = setInterval(()=>{
        timer--
        updat()
        if (timer <= 0) {clearInterval(id_interval); Start10()}
    }, 1000)
}

const id = document.currentScript.getAttribute("chrono_id") || "default"
mn.data.set("chrono_" + id, false)
mn.insert(document.currentScript, (updater, old_element_updater) => {
    updat = updater
    mn.data.bind("chrono_" + id, updater)
    mn.data.bind("chrono_" + id, old_element_updater((old_el) => {

    }))
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