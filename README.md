# Teste Técnico - Autenticação JWT com NestJS, DDD e Prisma

Projeto desenvolvido do zero conforme o enunciado.

## Tecnologias
- NestJS + TypeScript
- Prisma ORM (PostgreSQL)
- DDD (Domain, Application, Infrastructure, Presentation)
- JWT + bcrypt
- class-validator

## Como rodar
1. `npm install`
2. PostgreSQL local (user: postgres, senha: postgres)
3. `npx prisma migrate dev --name init`
4. `npm run start:dev`

## Endpoints
- POST /auth/register
- POST /auth/login → retorna access_token
- GET /profile → protegido com JWT
