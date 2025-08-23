import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Verificar si el usuario ya existe
  let user = await prisma.user.findUnique({
    where: { email: 'test@test.com' }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: 'password123',
        name: 'Usuario de Prueba',
        phone: '123456789',
        address: 'Calle Falsa 123',
        postalCode: '1234',
        birthDate: new Date('1990-01-01')
      },
    })
    console.log('Usuario creado:', user)
  } else {
    console.log('Usuario ya existe:', user)
  }

  // 2. Datos de productos
  const productsData = [
    // Productos para MUJER
    {
      name: 'Remera Deportiva Mujer Fit',
      price: 2990,
      category: 'mujer',
      subcategory: 'remeras',
      images: ['/images/mujer/remera1.jpg'],
      description: 'Remera deportiva de alta calidad para entrenamiento',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro', 'Blanco', 'Azul Marino'],
      stock: 25,
      featured: true
    },
    {
      name: 'Short Deportivo Mujer',
      price: 2490,
      category: 'mujer',
      subcategory: 'shorts',
      images: ['/images/mujer/short1.jpg'],
      description: 'Short cómodo para actividades deportivas',
      sizes: ['XS', 'S', 'M'],
      colors: ['Negro', 'Gris', 'Azul'],
      stock: 30,
      featured: false
    },
    // ... (los otros productos del ejemplo anterior)
  ]

  // 3. Crear productos solo si no existen
  for (const productData of productsData) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: productData.name,
        category: productData.category
      }
    })

    if (!existingProduct) {
      const product = await prisma.product.create({
        data: productData
      })
      console.log(`Producto creado: ${product.name}`)
    } else {
      console.log(`Producto ya existe: ${productData.name}`)
    }
  }

  // 4. Crear carrito solo si no existe
  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { CartItem: true }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id
      },
      include: { CartItem: true }
    })
    console.log('Carrito creado:', cart)

    // Agregar item al carrito
    const firstProduct = await prisma.product.findFirst()
    if (firstProduct) {
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: firstProduct.id,
          quantity: 2
        }
      })
      console.log('Item agregado al carrito:', cartItem)
    }
  } else {
    console.log('Carrito ya existe:', cart)
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error en el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })