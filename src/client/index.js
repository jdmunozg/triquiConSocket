const ADDRESS = "http://localhost:5000";
const socket = io.connect(ADDRESS);
var ultimoTurno;
socket.on("messages", (messages, estado) => {
    actualizar(messages, estado);

});

const actualizar = (messages, estado) => {
    const pos = messages
        .map((messages) => {
            return messages.posicion
        });
    const tip = messages
        .map((messages) => {
            return messages.tipo
        });
    if (pos.length != 1) {
        for (var i = 1; i < pos.length; i++) {
            var str = pos[i].toString();
            if (tip[i] == 0) {
                document.getElementById(str).src = "x.jpg";
                document.getElementById(str).onclick = null;
            }
            if (tip[i] == 1) {
                document.getElementById(str).src = "o.jpg";
                document.getElementById(str).onclick = null;
            }

        }
        ultimoTurno = tip[pos.length - 1];
    }
    if (estado == 0) {
        document.getElementById("ganador").innerHTML = "Jugando";
    }
    if (estado == 1) {
        document.getElementById("ganador").innerHTML = "Gano Jugador Uno";
    }
    if (estado == 2) {
        document.getElementById("ganador").innerHTML = "Gano Jugador Dos";
    }
    if (estado == 3) {
        document.getElementById("ganador").innerHTML = "Empate";
    }


};

const turno = (_, number) => {
    if (ultimoTurno == 0) {
        ultimoTurno = 1;
    } else {
        ultimoTurno = 0;
    }
    const message = {
        posicion: number,
        tipo: ultimoTurno,
    };
    console.log(message);
    socket.emit("new-message", message);
    return false;
};

function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 300);
    });
}