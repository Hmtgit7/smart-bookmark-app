export { PrismaClient } from './generated/prisma';
export type {
    User,
    Bookmark,
    VaultKey,
    Prisma,
} from './generated/prisma';

import { PrismaClient } from './generated/prisma';

let prisma: PrismaClient;

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.__prisma) {
        global.__prisma = new PrismaClient({
            log: ['query', 'error', 'warn'],
        });
    }
    prisma = global.__prisma;
}

export { prisma };
export default prisma;
