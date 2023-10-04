

mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("game.status", updater)
    mn.data.bind("newbomb", updater)
    mn.data.bind("bombs", old_element_updater((old_el) => {
        game.slots.forEach((player, pi) => {
            player.bombs.forEach((bomb, i) => {
                /**@type {HTMLElement} */
                const bombEl = old_el.find(el => {
                    return el.id === pi + "_bomb_" + i
                })
                bombEl.classList.toggle("invisible", !bomb.active);
                bombEl.style.transform = `translate(${bomb.position.x}px, ${bomb.position.y}px)`
                console.log(bomb.position);
            });

        });

    }))
    if (data.game.status) return []
    return [
        ...game.slots.map((player, pi) => {
            return player.bombs.map((bomb, i) => {
                return mn.element.create(
                    "div",
                    {
                        id: pi + "_bomb_" + i,
                        class: `bomb ${bomb.active ? "" : "invisible"}`,
                        // src: player.status.ready?player.info.image:"./style/default_user_void.png",
                        style: `transform: translate(${bomb.position.x}px, ${bomb.position.y}px)`,

                    },

                )
            })
        }).flat()
    ]
})