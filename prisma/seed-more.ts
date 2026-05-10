
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



async function main() {

  const categories = await prisma.category.findMany();

  const suppliers = await prisma.supplier.findMany();

  const firstSupplier = suppliers[0];

  if (!firstSupplier) throw new Error('No suppliers');



  const newEquipment = [

    { name: 'LED прожектор', price: 5000, city: 'Казань', categoryName: 'Световое оборудование' },

    { name: 'Микрофон проводной', price: 1500, city: 'Казань', categoryName: 'Звуковое оборудование' },

    { name: 'Удлинитель 10м', price: 800, city: 'Казань', categoryName: 'Электрика' },

    { name: 'Складной стул', price: 1200, city: 'Казань', categoryName: 'Мебель' },

    { name: 'Дым-машина', price: 12000, city: 'Казань', categoryName: 'Спецэффекты' },

  ];



  for (const eq of newEquipment) {

    const category = categories.find(c => c.name.includes(eq.categoryName));

    if (!category) continue;

    await prisma.equipment.create({

      data: {

        name: eq.name,

        price: eq.price,

        city: eq.city,

        images: 'https://cdn-icons-png.flaticon.com/512/115/115750.png',

        quantity: 1,

        available: 1,

        deliveryAvailable: true,

        userId: firstSupplier.userId,

        supplierId: firstSupplier.id,

        categoryId: category.id,

      },

    });

  }

  console.log(`Добавлено ${newEquipment.length} единиц в Казань`);

}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

