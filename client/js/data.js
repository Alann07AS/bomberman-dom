const data = //JSON.parse(localStorage.getItem("data")) || 
{
    username: "",
    game: {
        status: false
    }
}

function SaveData() {
    localStorage.setItem("data", JSON.stringify(data))
}

