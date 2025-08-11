import { PrismaClient } from '.prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: 'password123',
      name: 'Usuario de Prueba',
    },
  })

  const product = await prisma.product.create({
    data: {
      name: 'Producto Ejemplo',
      price: 99.99,
      category: 'general',
      stock: 10,
      images: [],
      description: 'Descripción de prueba',
    },
  })

  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      items: {
        create: {
          productId: product.id,
          quantity: 2,
        },
      },
    },
    include: {
      items: true,
    },
  })

  console.log('Datos creados:', { user, product, cart })
}

main()
  .catch((e) => {
    console.error('Error en el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })