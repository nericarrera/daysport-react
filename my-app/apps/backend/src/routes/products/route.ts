import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products?category=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    console.log('📦 Fetching products for category:', category);

    const products = await prisma.product.findMany({
      where: category ? { 
        category: category as string 
      } : {},
    });

    console.log('✅ Products found:', products.length);
    res.json({ products, total: products.length });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;