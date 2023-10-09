

mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("blasts", updater)
    return [
        ...blasts.flat().map((blast) => {
            return mn.element.create(
                "div",
                {
                    class: blast.sprite,
                    style: `
                    transform: translate(${blast.position.x}px, ${blast.position.y}px);
                    height:${blast.height};
                    width:${blast.width};
                    `,
                },

            )
        })
    ]
})