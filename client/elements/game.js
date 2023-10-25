// le jeu, son affichage

mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("page_status", updater)
    if (data.page_status !== "game") return []

    return [
        mn.element.create(
            "div",
            {
                id: "game",
            },
            //UI
            mn.element.create(
                "script",
                {
                    src: "./elements/ui.js"
                }
            ),

            // BACKGROUND
            mn.element.create(
                "div",
                {
                    class: "bg",
                },
                //WALLS
                mn.element.create(
                    "script",
                    {
                        src: "./elements/wall.js",
                    }
                )
                ,
                //PLAYERS
                mn.element.create(
                    "script",
                    {
                        src: "./elements/players.js"
                    },
                ),
                //BOMBS
                mn.element.create(
                    "script",
                    {
                        src: "./elements/bombs.js"
                    },
                ),
                //BLASTS
                mn.element.create(
                    "script",
                    {
                        src: "./elements/blasts.js"
                    },
                ),
                //BONUS
                mn.element.create(
                    "script",
                    {
                        src: "./elements/bonus.js"
                    },
                ),
            ),

            mn.element.create(
                "script",
                {
                    src: "./js/controleur.js"
                }
            ),
            mn.element.create(
                "script",
                {
                    src: "./elements/chrono.js",
                    chrono_id: "start",
                }
            ),
        )
    ]
})