"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🧹 Cleaning cart data...');
    await prisma.cartItem.deleteMany({});
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
