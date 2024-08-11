import { readFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { setTimeout } from "node:timers";

if(process.argv.length == 2) {
    console.log("sendtext HOST PORT FILEPATH");
    process.exit(1);
}

const hostname =process.argv[2];
const port = parseInt(process.argv[3]);
const filepath = process.argv[4];

const TIME_OUT = 10000;

let filedata = await readFile(filepath);
let lines = filedata.toString().split("\n");
for(let i = 0; i < lines.length; i++) {
    if(lines[i].length !== 0 && lines[i].slice(-1) === "\x0d") {
        lines[i] = lines[i].substring(0, lines[i].length - 1);
    }
}

let buf = "";
let index = 0;

let timerID:NodeJS.Timeout | null = null;

const sock = net.createConnection({host:hostname,
    port:port
});
sock.on("connect", ()=> {
    console.log("### connected");
    sock.write("copy con ");
    sock.write(path.basename(filepath));
    sock.write("\x0d\x0a");
    buf = "";
    timerID = setTimeout(()=>{
        console.log("Time out ERROR");
        sock.end();
        process.exit(1);
    }, TIME_OUT);
});
sock.on("close", hasError=>{
    console.log("close");
});

sock.on("data", data=>{
    buf+=data.toString();
    while(true) {
        const data = getOneLine(buf);
        if(data === null) {
            break;
        }
        const lineData = data.line;
        buf = data.buf;

        console.log("## " + lineData);
        if(index === lines.length) {
            sock.write("\x1a\x0d\x0a");
            sock.end();
            process.exit();
        }
        sock.write(lines[index]);
        sock.write("\x0d\x0a");
        index++;
        if(timerID !== null) {
            clearTimeout(timerID);
        }
        timerID = setTimeout(()=>{
            console.log("Time out ERROR");
            sock.write("\x1a\x0d\x0a");
            sock.end();
            process.exit(1);
        }, TIME_OUT);
    }
});

sock.on("error", err=>{
    console.log(err);
});

function getOneLine(buf:string):{buf:string, line:string} | null {
    const idx = buf.indexOf("\n");
    if(idx == -1) {
        return null;
    }
    let line = buf.substring(0, idx);
    const retbuf = buf.substring(idx+1);
    if(line.length !== 0 && line.slice(-1) === "\x0d") {
        line = line.substring(0, line.length - 1);
    }

    return {buf:retbuf, line:line};
}

