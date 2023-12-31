// les joueurs


mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("slots_change", old_element_updater((/**@type {Array<HTMLElement>}*/old_el) => {
        for (const i in game.slots) {
            const player = game.slots[i];
            /**@type {HTMLElement} */
            const el = old_el
            el[i].style.backgroundImage = `url("${player.status.ready ? player.info.image : ""}")`
            el[i].style.transform = `translate(${player.position.x}px, ${player.position.y}px)`
            const dead = player.pv <= 0;
            el[i].classList.toggle("invinsible", player.invinsible && !dead)
            el[i].classList.toggle("dead", dead)
            // old_el[0].children[i].src = j.info.image
        }
    }))
    if (data.game.status) return []
    return [
        ...game.slots.map(player => {
            return mn.element.create(
                "div",
                {
                    class: "slot",
                    // src: player.status.ready?player.info.image:"./style/default_user_void.png",
                    style: `background-image: url("${player.status.ready ? player.info.image : ""}");translate("${player.position.x}px, ${player.position.y}px")`,
                },

            )
        })
    ]
})