const data = //JSON.parse(localStorage.getItem("data")) || 
{
    page_status: "menus",
    username: "",
    // game: {
    //     status: false
    // }
}

data.game = game

function SaveData() {
    localStorage.setItem("data", JSON.stringify(data))
}

function PageStatus(status) {
    mn.data.update("page_status", _=>status)
}

function _startGame() {
    console.log(game);
    console.log(data.game);
    mn.data.update("game.status", _=> true)
    console.log(game.slots);
    console.log(data.game);
}