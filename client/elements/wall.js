

mn.insert(document.currentScript, (updater, oldEl_updater)=>{
    mn.data.bind("wall", updater)
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