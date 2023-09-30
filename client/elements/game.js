// le jeu, son affichage

mn.insert(document.currentScript, (updater, old_element_updater)=>{
    mn.data.bind("page_status", updater)
    if (data.page_status !== "game") return []
    return [
        mn.element.create(
            "div",
            {
                id: "game",
            },
            mn.element.create(
                "script",
                {
                    src: "./js/controleur.js"
                }
            ),
            mn.element.create(
                "script",
                {
                    src: "./elements/room.js"
                },
            )
        )
    ]
})