
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';



const prisma = new PrismaClient();



async function main() {

  const password = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({

    where: { email: 'demo@test.com' },

    update: {},

    create: {

      email: 'demo@test.com',

      password: password,

      name: 'Demo User',

    },

  });

  await prisma.equipment.createMany({

    data: [

      { name: 'Микрофон Shure SM58', price: 12000, city: 'Москва', images: '', userId: user.id },

      { name: 'Sennheiser EW 100 G4', price: 25000, city: 'Москва', images: '', userId: user.id },

      { name: 'JBL EON ONE MK2', price: 80000, city: 'Санкт-Петербург', images: '', userId: user.id },

    ],

  });

  console.log('Seed done');

}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

