"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common"); // ← Agregar Param aquí
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductsController = class ProductsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(category, subcategory, featured) {
        const where = {};
        if (category)
            where.category = category;
        if (subcategory)
            where.subcategory = subcategory;
        if (featured === 'true')
            where.featured = true;
        const products = await this.prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        return products;
    }
    async getProductById(id) {
        return this.prisma.product.findUnique({
            where: { id: parseInt(id) }
        });
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('products') // ← Endpoint: /products
    ,
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('subcategory')),
    __param(2, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/:id') // ← Endpoint: /products/1
    ,
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductById", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)() // ← Controlador en la raíz
    ,
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsController);
