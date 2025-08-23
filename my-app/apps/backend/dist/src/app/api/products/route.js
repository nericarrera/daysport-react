"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function GET(request) {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const featured = url.searchParams.get('featured');
        const whereClause = {};
        if (category)
            whereClause.category = category;
        if (featured === 'true')
            whereClause.featured = true;
        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
        return server_1.NextResponse.json(products, { status: 200 });
    }
    catch (error) {
        console.error('❌ Error fetching products:', error);
        return server_1.NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}
