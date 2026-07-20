import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, response: Response): Promise<{
        user: {
            id: string;
            email: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    me(req: any): Promise<any>;
}
