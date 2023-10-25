

mn.insert(document.currentScript, (updater, oldEl_updater)=>{
    mn.data.bind("wall", updater)
    mn.data.bind("walldestroy", oldEl_updater((old_el)=>{
        for (const wallId in game.wall_matrix) {
            if (game.wall_matrix[wallId].isDestroy) {
                // console.log("DESTROYEUR", game.wall_matrix[wallId].isDestroy);
                // console.log(old_el[wallId]);
                old_el[wallId].classList.toggle("softwall", false)        
                old_el[wallId].appendChild(
                    mn.element.create(
                        "img",
                        {
                            src: "./style/sprites/blast.gif?" + Date.now(),
                            class: "destroy",
                        }
                    )
                )
            }
        }
    }))

    return [
        ...game.wall_matrix.map(wall => {
                return mn.element.create(
                    "div",
                    {
                        class: wall.type,
                        style: `transform: translate(${wall.position.x}px, ${wall.position.y}px);`
                    }
                )
        })
    ]
})