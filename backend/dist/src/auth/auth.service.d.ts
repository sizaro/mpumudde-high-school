import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import("../../generated/prisma/enums.js").Role;
        };
    }>;
}
