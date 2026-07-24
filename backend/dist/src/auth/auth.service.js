var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginDto.email,
            },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const passwordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const roles = user.roles.map(userRole => userRole.role.name);
        const permissions = user.roles.flatMap(userRole => userRole.role.permissions.map(rolePermission => rolePermission.permission.name));
        const payload = {
            sub: user.id,
            email: user.email,
            roles,
            permissions,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                roles,
                permissions,
            },
        };
    }
    async register(registerDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: registerDto.email,
            },
        });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const role = await this.prisma.role.findUnique({
            where: {
                name: registerDto.role,
            },
        });
        if (!role) {
            throw new Error('Selected role does not exist');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                roles: {
                    create: {
                        roleId: role.id,
                    },
                },
                teacher: registerDto.role === 'TEACHER'
                    ? {
                        create: {
                            firstName: registerDto.firstName ?? 'Teacher',
                            lastName: registerDto.lastName ?? 'User',
                            phone: registerDto.phone,
                        },
                    }
                    : undefined,
                parent: registerDto.role === 'PARENT'
                    ? {
                        create: {
                            firstName: registerDto.firstName ?? 'Parent',
                            lastName: registerDto.lastName ?? 'User',
                            phone: registerDto.phone,
                            relationship: registerDto.relationship,
                        },
                    }
                    : undefined,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        const roles = newUser.roles.map(userRole => userRole.role.name);
        const permissions = [];
        const payload = {
            sub: newUser.id,
            email: newUser.email,
            roles,
            permissions,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: newUser.id,
                email: newUser.email,
                roles,
                permissions,
            },
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map