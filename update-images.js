
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



async function main() {

  const equipment = await prisma.equipment.findMany();

  for (const eq of equipment) {

    const imageId = parseInt(eq.id.slice(-6), 36) % 200;

    const imageUrl = `https://picsum.photos/id/${imageId}/300/200`;

    await prisma.equipment.update({

      where: { id: eq.id },

      data: { images: imageUrl },

    });

  }

  console.log('✅ Изображения обновлены');

}

main().catch(console.error).finally(() => prisma.$disconnect());

