const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client once
const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

module.exports = prisma;
