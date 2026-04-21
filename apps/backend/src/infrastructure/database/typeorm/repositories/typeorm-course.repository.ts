// Transforma entidades do domain em entidades de ORM para alteração e salvamento no banco e retorna como entidade do domain
// Transforma funções do repositório do domain em funções utilitárias do próprio ORM como:
// findById() --> findOne(), findPublished() --> find({ where: { isPublished: true } })

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from '../../../../domain/entities/course.entity';
import type { ICourseRepository } from '../../../../domain/repositories/course.repository';
import { CourseOrmEntity } from '../../orm/course.orm-entity';

@Injectable()
export class TypeOrmCourseRepository implements ICourseRepository {
    constructor(
        @InjectRepository(CourseOrmEntity)
        private readonly typeOrmRepo: Repository<CourseOrmEntity>,
    ) { }

    async create(course: CourseEntity): Promise<CourseEntity> {
        const ormEntity = this.toOrmEntity(course);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async findById(id: string): Promise<CourseEntity | null> {
        const found = await this.typeOrmRepo.findOne({ where: { id } });
        return found ? this.toDomainEntity(found) : null;
    }

    async findAll(): Promise<CourseEntity[]> {
        const found = await this.typeOrmRepo.find();
        return found.map((c) => this.toDomainEntity(c));
    }

    async findPublished(): Promise<CourseEntity[]> {
        const found = await this.typeOrmRepo.find({
            where: { isPublished: true },
        });
        return found.map((c) => this.toDomainEntity(c));
    }

    async update(course: CourseEntity): Promise<CourseEntity> {
        const ormEntity = this.toOrmEntity(course);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async delete(id: string): Promise<void> {
        await this.typeOrmRepo.delete({ id });
    }

    // Transforma entidade ORM em entidade de domain
    private toDomainEntity(orm: CourseOrmEntity): CourseEntity {
        return new CourseEntity({
            id: orm.id,
            title: orm.title,
            description: orm.description,
            isPublished: orm.isPublished,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    // Transforma entidade de domain em entidade ORM
    private toOrmEntity(domain: CourseEntity): CourseOrmEntity {
        const orm = new CourseOrmEntity();

        if (domain.id) {
            orm.id = domain.id;
        }

        orm.title = domain.title;
        orm.description = domain.description;
        orm.isPublished = domain.isPublished;

        return orm;
    }
}
