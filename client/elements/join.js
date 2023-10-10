mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("page_status", updater)

    if (data.page_status !== "join") return []
    const joinServer = (e)=>{
        if (e.code === "Enter" || e.type === "click") {
            /**@type {?} */
            var socket = io(mn.id("ip-lan").value);

            socket.on("connect", ()=>{
                console.log(socket.connected);
            })
        }
    }

    return [
        mn.element.create(
            "div",
            {
                class: "join",
            },
            mn.element.create(
                "div",
                {
                    class: "pulic"
                },
                mn.element.create(
                    "h3",
                    {
                        class: "join_part"
                    },
                    "Public"
                ),
            ),
            mn.element.create(
                "div",
                {
                    class: "private"
                },
                mn.element.create(
                    "h3",
                    {
                        class: "join_part"
                    },
                    "Private"
                ),
            ),
            mn.element.create(
                "div",
                {
                    class: "lan"
                },
                mn.element.create(
                    "h3",
                    {
                        class: "join_part"
                    },
                    "Lan"
                ),
                mn.element.create(
                    "label",
                    {
                        for: "ip-lan",
                    },
                    "Enter ip server to join:"
                ),
                mn.element.create(
                    "input",
                    {
                        value: "localhost:3000", //temp value
                        placeholder: "xxx.xxx.xxx.xx:xxxxx",
                        autocomplete: "off",
                        id: "ip-lan",
                        type: "text",
                        onkeydown: joinServer,
                    }
                ),
                mn.element.create(
                    "button",
                    {
                        id: "ip-lan",
                        type: "text",
                        onclick: joinServer,
                    },
                    "Join"
                )
            ),
        )
    ]
})