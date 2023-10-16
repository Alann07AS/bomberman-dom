

mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("bonus", updater)
    return [
        ...Bonus.list.map(bonus => {
            return mn.element.create(
                "div",
                {
                    class: `bonus `+ bonus.type,
                    style: `transform: translate(${bonus.position.x}px, ${bonus.position.y}px)`,
                },
            )
        })
    ]
})