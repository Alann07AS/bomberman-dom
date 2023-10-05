

mn.insert(document.currentScript, (updater, oldEl_updater)=>{
    mn.data.bind("wall", updater)
    return [
        ...wall_matrix.map(ligne => {
            return ligne.map(wall => {
                return mn.element.create(
                    "div",
                    {
                        class: wall.type,
                        style: `transform: translate(${wall.position.x}px, ${wall.position.y}px);`
                    }
                )
            })
        }).flat()
    ]
})