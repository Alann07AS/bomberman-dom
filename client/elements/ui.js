

mn.insert(document.currentScript, (updater, old_updater) => {

    return [
        mn.element.create(
            "div",
            {
                class: "ui pause",
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
                        ...life.map(_=>mn.element.create(
                            "div",
                            {
                                class: "life"
                            }
                        ))
                    ),
                    mn.element.create(
                        "div",
                        {
                            class: "rangesize",
                        },
                        "" + slot.range
                    ),
                    mn.element.create(
                        "div",
                        {
                            class: "bombbag",
                        },
                        "" + slot.bombs.length
                    ),
                )
            })
        ),
    ]
})