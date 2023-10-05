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
                mn.element.create(
                    "script",
                    {
                        src: "./elements/players.js"
                    },
                ),
                mn.element.create(
                    "script",
                    {
                        src: "./elements/bombs.js"
                    },
                )
            ),
            mn.element.create(
                "script",
                {
                    src: "./js/controleur.js"
                }
            ),

        )
    ]
})