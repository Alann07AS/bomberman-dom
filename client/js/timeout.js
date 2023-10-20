let _list_Timeout = {};
let _count_Timeout = 0;
let _live_count_Timeout = 0;

function Timeout(handler, time, ...args) {
    if (_live_count_Timeout === 0) _count_Timeout = 0;
    const lastTimestamp = document.timeline.currentTime;
    const id = _count_Timeout;
    _list_Timeout[id] = true;
    let lt = lastTimestamp
    const check = (timestamp) => {
        if (!_list_Timeout[id]) {_live_count_Timeout--; return}
        if ((timestamp - lastTimestamp) <= time-(timestamp - lt)/2) {
            requestAnimationFrame(check)
        } else {
            _live_count_Timeout--;
            handler(...args)
        }
        lt = timestamp
    }
    requestAnimationFrame(check)
    // const delay = time * 0.60
    // if (delay < 500) {
    // } else {
        // setTimeout(() => { requestAnimationFrame(check) }, delay)
    // }
    _count_Timeout++
    _live_count_Timeout++
    return id
}


function TimeoutClear(id) {
    delete _list_Timeout[id]
}

// le nouveau a remplacer un peut partout, et a ameliorer peuetre a cause du pas de 16(60fps autre si pas 60)
// précision +/- la durer moyenne d'une frame/2, (60 fps> 16,6ms/2)