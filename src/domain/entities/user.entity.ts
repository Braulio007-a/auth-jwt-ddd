/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { randomUUID } from 'crypto';
import { Email } from '../value-objects/email.vo';
import { DomainException } from '../exceptions/domain.exception';

export class User {
  private readonly id: string;
  private name: string;
  private email: Email;
  private passwordHash: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(id: string, name: string, email: Email, passwordHash: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(name: string, email: string, plainPassword: string): User {
    if (!name?.trim()) {
      throw new DomainException('Nome é obrigatório');
    }
    if (!plainPassword || plainPassword.length < 8) {
      throw new DomainException('Senha deve ter no mínimo 8 caracteres');
    }

    const emailVO = Email.create(email);

    return new User(randomUUID(), name.trim(), emailVO, plainPassword); // hash será aplicado depois
  }

  static reconstitute(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    const user = new User(id, name, Email.create(email), passwordHash);
    (user as any).createdAt = createdAt;
    (user as any).updatedAt = updatedAt;
    return user;
  }

  // Getters
  // eslint-disable-next-line prettier/prettier
  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email.toString(); }
  getPasswordHash(): string { return this.passwordHash; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  // Comportamentos
  setPasswordHash(hash: string): void {
    this.passwordHash = hash;
    this.updatedAt = new Date();
  }
}
