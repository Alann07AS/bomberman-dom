const data = //JSON.parse(localStorage.getItem("data")) || 
{
    page_status: "menus",
    username: "",
    game: {
        status: false
    }
}


function SaveData() {
    localStorage.setItem("data", JSON.stringify(data))
}

function PageStatus(status) {
    mn.data.update("page_status", _=>status)
}