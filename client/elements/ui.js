

mn.insert(document.currentScript, (updater, old_updater) => {

    mn.data.bind("game.status", old_updater((oldel) => {
        oldel[0].classList.toggle("pause", !game.status)
    }))

    mn.data.bind("update_player", old_updater((oldel) => {
        /**@type {HTMLElement} */
        const parent = oldel[0]
        const id = data.update_player
        const player = parent.children[id]
        const remainlife = player.querySelectorAll(".life")
        console.log(remainlife.length, game.slots[id].pv);
        if (remainlife[0] && remainlife.length != game.slots[id].pv) {
            remainlife[0].classList.toggle("deadlife", true)
            remainlife[0].classList.toggle("life", false)
        }
        player.querySelector(".rangesize").children[0].textContent = game.slots[id].range
        player.querySelector(".bombbag").children[0].textContent = game.slots[id].bombs.length
    }))

    return [
        mn.element.create(
            "div",
            {
                class: "ui " + (!game.status ? "pause" : ""),
            },
            ...game.slots.map((slot, i) => {
                const life = new Array(slot.pv)
                life.fill(0, 0, slot.pv)

                return mn.element.create(
                    "div",
                    {
                        id: "player_" + i,
                        class: "slotui"
                    },
                    mn.element.create(
                        "img",
                        {
                            class: "avatar",
                            src: slot.info.image,
                        }
                    ),
                    mn.element.create(
                        "div",
                        {
                            class: "lifediv",
                        },
                        ...life.map(_ => mn.element.create(
                            "img",
                            {
                                style: `width: calc(100% / ${life.length});`,
                                class: "life",
                                src: "./style/sprites/heart.png",
                            }
                        ))
                    ),
                    mn.element.create(
                        "div",
                        {
                            class: "rangesize",
                        },
                        `<p>${slot.range}</p>`
                    ),
                    mn.element.create(
                        "div",
                        {
                            class: "bombbag",
                        },
                        `<p>${slot.bombs.length}</p>`
                    ),
                )
            })
        ),
    ]
})