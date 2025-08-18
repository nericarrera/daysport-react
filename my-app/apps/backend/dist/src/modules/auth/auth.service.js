"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    // -------------------- Registro --------------------
    async register(registerDto) {
        const { email, password, name, phone, address, postalCode, birthDate } = registerDto;
        // Validar si ya existe
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('El email ya está registrado');
        }
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                address,
                postalCode,
                birthDate: birthDate ? new Date(birthDate) : null,
            },
        });
        return { message: 'User registered successfully', user: { ...user, password: undefined } };
    }
    // -------------------- Validación de usuario --------------------
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return null;
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return null;
        return user;
    }
    // -------------------- Login --------------------
    async login(user) {
        const token = this.jwtService.sign({ sub: user.id, email: user.email });
        return { message: 'Login successful', access_token: token, user: { id: user.id, email: user.email, name: user.name } };
    }
    // -------------------- Recuperación de contraseña --------------------
    async sendResetPasswordEmail(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Email not found');
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // Expira en 1 hora
        await this.prisma.resetToken.create({
            data: {
                token,
                userId: user.id,
                expires,
            },
        });
        // Temporal: devolver token para testing
        return { message: 'Reset password email sent', token };
    }
    async resetPassword(token, password) {
        const tokenRecord = await this.prisma.resetToken.findUnique({ where: { token } });
        if (!tokenRecord || tokenRecord.expires < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.user.update({
            where: { id: tokenRecord.userId },
            data: { password: hashedPassword },
        });
        await this.prisma.resetToken.delete({ where: { token } });
        return { message: 'Password updated successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
