import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function rehashPasswords() {
  try {
    const users = await prisma.user.findMany();

    for (const user of users) {
      // Si la contraseña ya parece un hash (empieza con $2b$), saltamos
      if (user.password.startsWith('$2b$')) {
        console.log(`Usuario ${user.email} ya tiene contraseña hasheada. Saltando...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log(`Contraseña de ${user.email} rehasheada correctamente.`);
    }

    console.log('✅ Todas las contraseñas han sido actualizadas.');
  } catch (error) {
    console.error('Error rehasheando contraseñas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

rehashPasswords();