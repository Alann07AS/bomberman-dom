mn.insert(document.currentScript, (updater, old_element_updater) => {
    console.log(data.username);
    if (data.username !== "") return []

    const onvalid = (/**@type {Event}*/e) => {
        if (e.type !== "click" && e.key !== "Enter") return
        data.username = mn.id("login_input").value
        SaveData()
    }

    return [
        mn.element.create(
            "div",
            {
                id: "login_div",
            },
            mn.element.create(
                "input",
                {
                    id: "login_input",
                    onkeyup: onvalid,
                },
            ),
            mn.element.create(
                "button",
                {
                    onclick: onvalid,
                },
                "Valid"
            )
        )
    ]
})