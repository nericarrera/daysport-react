// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Crear usuario
  const user = await prisma.user.create({
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

  // 2. Crear productos de ejemplo para cada categoría
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

    // Productos para HOMBRE
    {
      name: 'Remera Deportiva Hombre',
      price: 2790,
      category: 'hombre',
      subcategory: 'remeras',
      images: ['/images/hombre/remera1.jpg'],
      description: 'Remera deportiva para hombre',
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Negro', 'Blanco', 'Rojo'],
      stock: 20,
      featured: true
    },
    {
      name: 'Pantalón Deportivo Hombre',
      price: 3990,
      category: 'hombre',
      subcategory: 'pantalones',
      images: ['/images/hombre/pantalon1.jpg'],
      description: 'Pantalón cómodo para entrenamiento',
      sizes: ['M', 'L', 'XL'],
      colors: ['Negro', 'Gris'],
      stock: 15,
      featured: true
    },

    // Productos para NIÑOS
    {
      name: 'Conjunto Deportivo Niño',
      price: 4590,
      category: 'ninos',
      subcategory: 'conjuntos',
      images: ['/images/ninos/conjunto1.jpg'],
      description: 'Conjunto deportivo para niños',
      sizes: ['4', '6', '8', '10'],
      colors: ['Azul', 'Rojo', 'Verde'],
      stock: 18,
      featured: true
    },

    // Productos para ACCESORIOS
    {
      name: 'Botella Deportiva 750ml',
      price: 1990,
      category: 'accesorios',
      subcategory: 'hidratacion',
      images: ['/images/accesorios/botella1.jpg'],
      description: 'Botella deportiva de alta calidad',
      sizes: ['Único'],
      colors: ['Azul', 'Negro', 'Verde'],
      stock: 50,
      featured: true
    },
    {
      name: 'Gorra Deportiva',
      price: 1590,
      category: 'accesorios',
      subcategory: 'gorras',
      images: ['/images/accesorios/gorra1.jpg'],
      description: 'Gorra deportiva ajustable',
      sizes: ['Único'],
      colors: ['Negro', 'Blanco', 'Gris'],
      stock: 35,
      featured: false
    }
  ]

  // Crear todos los productos
  const products = []
  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: productData
    })
    products.push(product)
    console.log(`Producto creado: ${product.name}`)
  }

  // 3. Crear carrito para el usuario
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      // Los items del carrito se crean por separado
    }
  })

  console.log('Carrito creado:', cart)

  // 4. Agregar items al carrito
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: products[0].id, // Primer producto
      quantity: 2
    }
  })

  console.log('Item agregado al carrito:', cartItem)

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