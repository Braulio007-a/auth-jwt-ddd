import { DomainException } from '../exceptions/domain.exception';

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email.toLowerCase().trim();
  }

  static create(email: string): Email {
    if (!email) {
      throw new DomainException('Email é obrigatório');
    }

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      throw new DomainException('Formato de email inválido');
    }

    return new Email(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
