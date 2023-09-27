//le menu du jeu

mn.insert(document.currentScript, (updaters, old_elements_updater) => {
    mn.data.bind("page_status", updaters)
    if (data.page_status !== "menus") return []
    return [
        mn.element.create(
            "div",
            {
                class: "menu",
            },
            mn.element.create(
                "ul",
                {
                    class: "menu-list"
                },
                mn.element.create(
                    "li",
                    {
                        class: "menu_li"
                    },
                    mn.element.create(
                        "button",
                        {
                            class: "menu_bt",
                            onclick: ()=>PageStatus("game"),
                        },
                        "Play"
                    ),
                ),
                mn.element.create(
                    "li",
                    {
                        class: "menu_li"
                    },
                    mn.element.create(
                        "button",
                        {
                            class: "menu_bt"
                        },
                        "Join"
                    ),
                ),
                mn.element.create(
                    "li",
                    {
                        class: "menu_li"
                    },
                    mn.element.create(
                        "button",
                        {
                            class: "menu_bt"
                        },
                        "Settings"
                    ),
                ),
            )
        )
    ]

})