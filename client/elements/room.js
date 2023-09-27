// salle d'attente pour rejoindre les slote de jeu


mn.insert(document.currentScript, (updater, old_element_updater)=>{
    mn.data.bind("game.status", updater)
    mn.data.bind("slots_change", old_element_updater((/**@type {Array<HTMLElement>}*/old_el)=>{
        game.slots.forEach((j, i)=>{
            old_el[0].children[i].style.backgroundImage = `url("${j.info.image}")`
            // old_el[0].children[i].src = j.info.image
        })
    }))
    if (data.game.status) return []
    return [
        mn.element.create(
            "div",
            {
                id: "div_slot"
            },
            ...game.slots.map(player=> {
                return mn.element.create(
                    "div",
                    {
                        class: "slot",
                        // src: player.status.ready?player.info.image:"./style/default_user_void.png",
                        style: `background-image: url("${player.status.ready?player.info.image:"./style/default_user_void.png"}")`,
                        onclick: (e)=> {
                            player.bind(e)
                        }
                    },

                )
            })
        )
    ]
})