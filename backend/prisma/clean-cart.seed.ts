import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning cart data...');

  // =========================================================
  // 1. DELETE CART ITEMS FIRST (IMPORTANT بسبب العلاقات)
  // =========================================================
  await prisma.cartItem.deleteMany({});

  // =========================================================
  // 2. DELETE CARTS
  // =========================================================
  await prisma.cart.deleteMany({});

  console.log('✅ Cart + CartItems cleaned successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error cleaning cart:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });