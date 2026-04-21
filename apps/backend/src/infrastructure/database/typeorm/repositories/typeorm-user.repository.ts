// Transforma entidades do domain em entidades de ORM para alteração e salvamento no banco e retorna como entidade do domain
// Transforma funções do repositório do domain em funções utilitárias do próprio ORM como:
// findByEmail() --> findOne()

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserEntity,
  UserRole,
} from '../../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import type { IUserRepository } from '../../../../domain/repositories/user.repository';
import { UserOrmEntity } from '../../orm/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly typeOrmRepo: Repository<UserOrmEntity>,
  ) { }

  async create(user: UserEntity): Promise<UserEntity> {
    const ormEntity = this.toOrmEntity(user);
    const saved = await this.typeOrmRepo.save(ormEntity);
    return this.toDomainEntity(saved);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const found = await this.typeOrmRepo.findOne({ where: { email } });
    return found ? this.toDomainEntity(found) : null;
  }

  async findAll(role?: UserRole): Promise<UserEntity[]> {
    const where = role ? { role } : {};
    const foundUsers = await this.typeOrmRepo.find({ where });
    return foundUsers.map((u) => this.toDomainEntity(u));
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const ormEntity = this.toOrmEntity(user);
    const saved = await this.typeOrmRepo.save(ormEntity);
    return this.toDomainEntity(saved);
  }

  async delete(email: string): Promise<void> {
    await this.typeOrmRepo.delete({ email });
  }

  // Transforma entidade ORM em entidade de domain
  private toDomainEntity(orm: UserOrmEntity): UserEntity {
    return new UserEntity({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      passwordHash: orm.passwordHash,
      role: orm.role,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  // Transforma entidade de domain em entidade ORM
  private toOrmEntity(domain: UserEntity): UserOrmEntity {
    const orm = new UserOrmEntity();

    if (domain.id) {
      orm.id = domain.id;
    }

    orm.name = domain.name;
    orm.email = domain.email;
    orm.passwordHash = domain.passwordHash;
    orm.role = domain.role;

    return orm;
  }
}
