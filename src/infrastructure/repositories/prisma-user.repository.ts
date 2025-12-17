/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/infrastructure/repositories/prisma-user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../prisma/user.mapper';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const rawUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  async save(user: User): Promise<void> {
    try {
      await this.prisma.user.upsert({
        where: { id: user.getId() },
        update: UserMapper.toPersistence(user),
        create: UserMapper.toPersistence(user),
      });
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2002') {
        // Violação de unique constraint (email)
        throw new ConflictException('Este email já está em uso');
      }
      throw error; // outras exceções propagam
    }
  }
}
