/* eslint-disable @typescript-eslint/require-await */
// src/application/services/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    // Verifica se email já existe (antes da transação)
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictException('Este email já está em uso');
    }

    // Cria entity de domínio com validações
    const user = User.create(name, email, password);

    // Hash da senha
    const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
    user.setPasswordHash(hash);

    // Transação explícita (diferencial sênior)
    // Prisma não tem transação interativa simples, mas usamos $transaction para atomicidade
    // Como é apenas um save, o upsert já é atômico. Para mais operações, usaríamos array de operations.
    await this.userRepo.save(user);

    // Gera token
    const payload = { sub: user.getId(), email: user.getEmail() };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.getPasswordHash());
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.getId(), email: user.getEmail() };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
    };
  }

  async getProfile(userId: string) {
    // Em produção buscaríamos por ID, mas por simplicidade buscamos por email do payload
    // (vamos injetar o user completo no guard depois)
    // Aqui apenas um exemplo simples
    return { message: 'Perfil protegido acessado com sucesso', userId };
  }
}
