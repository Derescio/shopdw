import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';
// import { hash } from '@/lib/encrypt';
// import { hashSync } from 'bcrypt-ts-edge';

async function seed() {
    const prisma = new PrismaClient();
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.createMany({ data: sampleData.products });
    await prisma.user.createMany({ data: sampleData.users });
    console.log('Succesful Seeeding')
}
seed()