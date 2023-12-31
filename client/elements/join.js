
mn.insert(document.currentScript, (updater, old_element_updater) => {
    mn.data.bind("page_status", updater)

    if (data.page_status !== "join") return []
    const joinServer = (e) => {
        if (e.code === "Enter" || e.type === "click" || e === true) {
            /**@type {?} */
            // mn.data.update("sslpopup", _ => mn.id("ip-lan").value)

            socket = io(mn.id("ip-lan").value, {
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
                const check = () => {
                    if (!handle || !handle.closed) {
                        requestAnimationFrame(check)
                    } else {
                        joinServer(true)
                    }
                }
                check()
            });

            socket.on("connect", () => {
                socket.emit("game")
            })

            const update_ui = (player, id) => {
                const slot = game.slots[id]
                slot.status = player.status
                slot.range = player.range
                slot.pv = player.pv
                //bomb a ajouter
                mn.data.update("update_player", _ => id)
            }
            const updatePlayer = (players) => {
                for (const skey in players) {
                    const slot = game.slots[skey]
                    if (slot.controleur) continue
                    slot.position = players[skey].position
                    // slot.bombs = players[skey].bombs
                    update_ui(players[skey], skey)
                    slot.invinsible = players[skey].invinsible
                }
                mn.data.update("slots_change")
            }

            //update all game
            socket.on("game", (gameserver) => {
                game.wall_matrix = gameserver.walls
                updatePlayer(gameserver.players)
                PageStatus("game")
            })
            socket.on("addplayer", (gameserver) => {
                updatePlayer(gameserver.players)
                // PageStatus("game")
            })

            socket.on("pv", (pv, id) => {
                game.slots[id].pv = pv;
                mn.data.update("update_player", _ => id)
            })

            //update player position
            socket.on("playerpos", (playerid, x, y) => {
                game.slots[playerid].position.x = x;
                game.slots[playerid].position.y = y;
                game.slots[playerid].move
                mn.data.update("slots_change")
            })

            //update player pos bomb
            socket.on("bomb", (playerid, bombid, timeStamp) => {
                game.slots[playerid].poseBombId(bombid, timeStamp)
            })

            //update player pos bomb
            socket.on("bonus", (x, y, type) => {
                new Bonus({ x, y }, type, false)
            })

            //timer
            socket.on("Start10", () => {
                Start10()
            })
            socket.on("Start20", () => {
                Start20()
            })

            socket.on("start", (timestamp) => {
                console.log(timestamp);
                async function start() {
                    while (Date.now()< timestamp) {}
                    _startGame()
                }
                start()
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
                        value: "https://192.168.101.28:3000", //temp value
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