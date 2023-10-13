
mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("page_status", updater)

    if (data.page_status !== "join") return []
    const joinServer = (e) => {
        if (e.code === "Enter" || e.type === "click" || e === true) {
            /**@type {?} */
            // mn.data.update("sslpopup", _ => mn.id("ip-lan").value)

            var socket = io(mn.id("ip-lan").value, {
                reconnection: false,
            });
            //handle serveur error conection
            socket.on("connect_error", (err) => {
                const height = 700
                const width = 400
                const continu = confirm("You need to accept server ssl !")
                if (!continu) return
                const windowFeatures = `left=${window.innerWidth / 2},top=${window.innerHeight / 2},width=${width},height=${height}`;
                const handle = window.open(
                    mn.id("ip-lan").value,
                    "window",
                    windowFeatures,
                );
                const check = ()=>{
                    if (!handle || !handle.closed) {
                        requestAnimationFrame(check)
                    } else {
                        joinServer(true)
                    }
                }
                check()
            });

            socket.on("connect", () => {
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
                        value: "https://192.168.1.52:3000", //temp value
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
        ),
    ]
})