function convertTimeToString(time) {
    let ans = "";
    let [day, hour, min, sec] = time;
    if (day !== 0) ans += (day + " days, ")
    ans += (hour + " hrs, ");
    ans += (min + " minutes, ");
    ans += (sec + " seconds");
    return ans;
}

function time100x(time) {
    let hour = Math.floor(time / 3600);
    let day = Math.floor(hour / 24);
    hour = hour % 24;
    let min = Math.floor((time % 3600) / 60);
    let sec = time % 60;
    return [day, hour, min, sec];
}

function time125x(time) {
    time = Math.floor(time / (1.25));
    return time100x(time);
}

function time150x(time) {
    time = Math.floor(time / (1.5));
    return time100x(time);
}

function time175x(time) {
    time = Math.floor(time / (1.75));
    return time100x(time);
}

function time200x(time) {
    time = Math.floor(time / (2));
    return time100x(time);
}

module.exports = {
    time100x: time100x,
    time125x: time125x,
    time150x: time150x,
    time175x: time175x,
    time200x: time200x,
    convertTimeToString: convertTimeToString
}
