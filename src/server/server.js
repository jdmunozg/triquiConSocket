const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("src/client"));

var estado = 0;
let primerJugador = [];
let segJugador = [];
let messages = [{}, ];

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("messages", messages, estado);
    socket.on("new-message", (message) => {
        messages.push(message);
        sacarArreglos();
        if (ganofila(primerJugador) == true || ganocolumna(primerJugador) == true || ganoenequis(primerJugador) == true) {
            estado = 1;
        }
        if (ganofila(segJugador) == true || ganocolumna(segJugador) == true || ganoenequis(segJugador) == true) {
            estado = 2;
        }

        console.log(primerJugador.length + segJugador.length);
        if ((primerJugador.length + segJugador.length) == 20 && estado != 2 && estado != 1) {
            estado = 3;
        }
        io.emit("messages", messages, estado);
        if (estado == 1 || estado == 2 || estado == 3) {
            estado = 0;
            for (let i = messages.length; i > 1; i--) {
                messages.pop();
            }

        }
    });

});

function sacarArreglos() {
    primerJugador = messages
        .map((messages) => {
            if (messages.tipo == 0)
                return messages.posicion
        });
    segJugador = messages
        .map((messages) => {
            if (messages.tipo == 1)
                return messages.posicion
        });
}

function ganofila(arreglo) {
    var sumador = 0;
    var iterador = 3;
    var estado = false;
    for (var primera = 0; primera <= iterador; primera++) {
        if (arreglo.includes(primera) == true) {
            sumador++;
            if (sumador == 3) {
                estado = true;
                break;
            }
        }
        if (primera == iterador && iterador != 9) {
            iterador = iterador + 3;
            sumador = 0;
        }
    }
    return estado;
}

function ganocolumna(arreglo) {
    var sumador = 0;
    var iterador = 7;
    var estado = false;
    var primera = 1;
    var cont = 0;
    var estadocont = true;
    while (primera <= iterador) {
        if (arreglo.includes(primera) == true) {
            sumador++;
            if (sumador == 3) {
                estado = true;
                break;
            }
        }

        if (primera == iterador && iterador != 9) {
            iterador++;
            sumador = 0;
            cont++;
            primera = cont + 1;
            estadocont = false;
        }
        if (estadocont == true) {
            primera = primera + 3;
        }
        estadocont = true;


    }
    return estado;
}

function ganoenequis(arreglo) {
    var iterador = 3;
    var numero = 7;
    var estado = false;
    var i = 0;
    var estadocont = true;
    while (iterador <= numero) {

        if (arreglo.includes(iterador) == true) {
            i++;
            if (i == 3) {
                estado = true;

                break;
            }
        }

        if (iterador == numero && numero != 9) {
            numero = 9;
            iterador = 1;
            i = 0;
            estadocont = false;
        }
        if (estadocont == true && numero == 7) {
            iterador = iterador + 2;
        }
        if (estadocont == true && numero == 9) {
            iterador = iterador + 4;
        }
        estadocont = true;

    }
    return estado;
}

server.listen(5000, () => {
    console.log("Server corriendo");
});