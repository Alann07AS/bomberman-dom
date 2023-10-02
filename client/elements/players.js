// salle d'attente pour rejoindre les slote de jeu


mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("game.status", updater)
    mn.data.bind("slots_change", old_element_updater((/**@type {Array<HTMLElement>}*/old_el) => {
        game.slots.forEach((player, i) => {
            /**@type {HTMLElement} */
            const el = old_el
            el[i].classList.toggle("transition", player.isAline)
            el[i].style.backgroundImage = `url("${player.status.ready ? player.info.image : "./style/default_user_void.png"}")`
            el[i].style.transform = `translate(${player.position.x}px, ${player.position.y}px)`
            // old_el[0].children[i].src = j.info.image
        })
    }))
    if (data.game.status) return []
    return [
        ...game.slots.map(player => {
            return mn.element.create(
                "div",
                {
                    class: "slot",
                    // src: player.status.ready?player.info.image:"./style/default_user_void.png",
                    style: `background-image: url("${player.status.ready ? player.info.image : "./style/default_user_void.png"}");translate("${player.position.x}px, ${player.position.y}px")`,
                    onclick: (e) => {
                        player.bind(e)
                    }
                },

            )
        })
    ]
})