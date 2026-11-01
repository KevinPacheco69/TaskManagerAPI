let io;

const initializeSocket = (httpServer) => {
    const { Server } = require("socket.io");

    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO no ha sido inicializado.");
    }

    return io;
};

module.exports = {
    initializeSocket,
    getIO
};
