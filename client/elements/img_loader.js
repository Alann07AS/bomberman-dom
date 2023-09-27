// charge toute les images du jeu en avance

const imgs = [
    "./style/bomb_logo.png",
    "./style/bombs.jpg",
    "./style/default_user_void.png",
    "./style/default_user.png",
]

mn.insert(document.currentScript, (updater, old_element_updater)=>{
    return imgs.map(img=>{
        return [
            mn.element.create(
                "img",
                {
                    src: img,
                    style: `display: none;`,
                },
            ),
            mn.element.create(
                "div",
                {
                    style: `background-image:url("${img}");height:1px;width:1px;position: absolute;`,
                },
            )
        ]
    }).flat()
})