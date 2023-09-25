//le menu du jeu

mn.insert(document.currentScript, (updaters,old_elements_updater)=>{
    mn.data.bind("game.status", updaters)
    if (data.game.status) {
        return []
    } else {
        return [
            mn.element.create(
                "ul",
                {
                    class: "menu-list"
                },
                mn.element.create(
                    "li",
                    {
                        class:"menu_li"
                    },
                    mn.element.create(
                        "button",
                        {
                            class:"menu_bt"
                        },
                        "Play"
                    ),
                ),
                mn.element.create(
                    "li",
                    {
                        class:"menu_li"
                    },
                    mn.element.create(
                        "button",
                        {
                            class:"menu_bt"
                        },
                        "Join"
                    ),
                ),
                mn.element.create(
                    "li",
                    {
                        class:"menu_li"
                    },
                    mn.element.create(
                        "button",
                        {
                            class:"menu_bt"
                        },
                        "Settings"
                    ),
                ),
            )
        ]
    }
})