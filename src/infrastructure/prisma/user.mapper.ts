/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/infrastructure/prisma/user.mapper.ts
import { User } from '../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(raw: any): User {
    return User.reconstitute(
      raw.id,
      raw.name,
      raw.email,
      raw.passwordHash,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(user: User): any {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      passwordHash: user.getPasswordHash(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
