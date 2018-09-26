export function keepAlive(timeout: number = 300000) {
    const http = require("http");
    setInterval(function() {
        console.log('ping to keep alive...');
        http.get(process.env.PING_URL);
    }, timeout);
}