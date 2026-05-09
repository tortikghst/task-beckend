
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';



const prisma = new PrismaClient();



async function main() {

  const passwordHash = await bcrypt.hash('123456', 10);



  // Пользователи

  const admin = await prisma.user.upsert({

    where: { email: 'admin@ghostevent.com' },

    update: {},

    create: { email: 'admin@ghostevent.com', password: passwordHash, name: 'Admin', role: 'ADMIN' },

  });

  const client = await prisma.user.upsert({

    where: { email: 'client@example.com' },

    update: {},

    create: { email: 'client@example.com', password: passwordHash, name: 'Client User', role: 'CLIENT' },

  });

  const supplierUser = await prisma.user.upsert({

    where: { email: 'supplier@example.com' },

    update: {},

    create: { email: 'supplier@example.com', password: passwordHash, name: 'Supplier User', role: 'SUPPLIER' },

  });



  // Поставщик

  const supplier = await prisma.supplier.upsert({

    where: { userId: supplierUser.id },

    update: {},

    create: {

      userId: supplierUser.id,

      companyName: 'ProSound Equipment',

      description: 'Ведущий поставщик звукового оборудования',

      phone: '+74951234567',

      email: 'sales@prosound.ru',

      rating: 4.8,

      reviewCount: 120,

    },

  });



  // Категории

  const categories = await Promise.all([

    prisma.category.upsert({ where: { name: 'Звуковое оборудование' }, update: {}, create: { name: 'Звуковое оборудование', description: 'Микрофоны, акустика, микшеры' } }),

    prisma.category.upsert({ where: { name: 'Световое оборудование' }, update: {}, create: { name: 'Световое оборудование', description: 'Прожекторы, софиты, лазеры' } }),

    prisma.category.upsert({ where: { name: 'Видеооборудование' }, update: {}, create: { name: 'Видеооборудование', description: 'Проекторы, экраны, видеомикшеры' } }),

    prisma.category.upsert({ where: { name: 'Спецэффекты' }, update: {}, create: { name: 'Спецэффекты', description: 'Дым, туман, конфетти' } }),

    prisma.category.upsert({ where: { name: 'Сценическое оборудование' }, update: {}, create: { name: 'Сценическое оборудование', description: 'Сцены, подиумы, мебель' } }),

  ]);



  // Оборудование (минимум 10 единиц)

  const equipmentData = [

    { name: 'Микрофон Shure SM58', price: 12000, city: 'Москва', description: 'Вокальный микрофон', categoryId: categories[0].id, supplierId: supplier.id, quantity: 10, available: 8, deliveryAvailable: true },

    { name: 'Sennheiser EW 100 G4', price: 25000, city: 'Москва', description: 'Радиомикрофон', categoryId: categories[0].id, supplierId: supplier.id, quantity: 5, available: 3, deliveryAvailable: true },

    { name: 'JBL EON ONE MK2', price: 80000, city: 'Санкт-Петербург', description: 'Акустическая система', categoryId: categories[0].id, supplierId: supplier.id, quantity: 2, available: 1, deliveryAvailable: false },

    { name: 'LED PAR 64', price: 8000, city: 'Москва', description: 'Светодиодный прожектор', categoryId: categories[1].id, supplierId: supplier.id, quantity: 20, available: 15, deliveryAvailable: true },

    { name: 'Moving Head Beam', price: 45000, city: 'Москва', description: 'Вращающаяся голова', categoryId: categories[1].id, supplierId: supplier.id, quantity: 8, available: 5, deliveryAvailable: true },

    { name: 'Epson EB-695Wi', price: 120000, city: 'Казань', description: 'Ультракороткофокусный проектор', categoryId: categories[2].id, supplierId: supplier.id, quantity: 3, available: 2, deliveryAvailable: true },

    { name: 'Проекционный экран 3x2м', price: 15000, city: 'Москва', description: 'Рулонный экран', categoryId: categories[2].id, supplierId: supplier.id, quantity: 5, available: 4, deliveryAvailable: true },

    { name: 'Генератор дыма', price: 12000, city: 'Санкт-Петербург', description: 'Дым-машина', categoryId: categories[3].id, supplierId: supplier.id, quantity: 4, available: 2, deliveryAvailable: true },

    { name: 'Конфетти-пушка', price: 8000, city: 'Москва', description: 'Пневматическая пушка', categoryId: categories[3].id, supplierId: supplier.id, quantity: 6, available: 4, deliveryAvailable: false },

    { name: 'Сцена сборная 4x3м', price: 50000, city: 'Москва', description: 'Сценическая конструкция', categoryId: categories[4].id, supplierId: supplier.id, quantity: 2, available: 1, deliveryAvailable: true },

  ];



  for (const eq of equipmentData) {

    // Используем уникальность по имени (но лучше по id, но так для upsert)

    await prisma.equipment.upsert({

      where: { id: eq.name }, // не сработает, поэтому просто создаём

      update: {},

      create: {

        name: eq.name,

        price: eq.price,

        city: eq.city,

        description: eq.description,

        categoryId: eq.categoryId,

        supplierId: eq.supplierId,

        quantity: eq.quantity,

        available: eq.available,

        deliveryAvailable: eq.deliveryAvailable,

        userId: supplier.userId,

      },

    }).catch(() => prisma.equipment.create({ data: { ...eq, userId: supplier.userId } }));

  }



  console.log('✅ Seed завершён');

}



main()

  .catch(e => console.error(e))

  .finally(async () => await prisma.$disconnect());

