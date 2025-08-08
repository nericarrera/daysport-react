import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Crear User
  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: 'password123',
      name: 'Usuario de Prueba'
    }
  })

  // Crear Product
  const product = await prisma.product.create({
    data: {
      name: 'Producto Ejemplo',
      price: 99.99,
      category: 'general',
      stock: 10,
      images: [], // Campo requerido según tu schema
      description: 'Descripción de prueba' // Campo opcional
    }
  })

  // Crear Cart con relación
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      items: {
        create: {
          productId: product.id,
          quantity: 2
        }
      }
    },
    include: {
      items: true // Incluir los items relacionados
    }
  })

  console.log('Datos creados:', { user, product, cart })
}

main()
  .catch(e => {
    console.error('Error en el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })