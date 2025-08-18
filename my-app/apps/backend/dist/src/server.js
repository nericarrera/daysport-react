"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Importar tus rutas
const user_Routes_1 = __importDefault(require("./modules/user/user.Routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)()); // <-- permite requests de cualquier origen
app.use(express_1.default.json()); // <-- para recibir JSON
// Rutas
app.use("/users", user_Routes_1.default);
// Arrancar servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
