// Transforma entidades do domain em entidades de ORM para alteração e salvamento no banco e retorna como entidade do domain
// Transforma funções do repositório do domain em funções utilitárias do próprio ORM como:
// findByCourseId() --> find({ where: { courseId } }), findByCourseIdAndOrder() --> findOne({ where: { courseId, order } })

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonEntity } from '../../../../domain/entities/lesson.entity';
import type { ILessonRepository } from '../../../../domain/repositories/lesson.repository';
import { LessonOrmEntity } from '../../orm/lesson.orm-entity';

@Injectable()
export class TypeOrmLessonRepository implements ILessonRepository {
    constructor(
        @InjectRepository(LessonOrmEntity)
        private readonly typeOrmRepo: Repository<LessonOrmEntity>,
    ) { }

    async create(lesson: LessonEntity): Promise<LessonEntity> {
        const ormEntity = this.toOrmEntity(lesson);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async findById(id: string): Promise<LessonEntity | null> {
        const found = await this.typeOrmRepo.findOne({ where: { id } });
        return found ? this.toDomainEntity(found) : null;
    }

    async findByCourseId(courseId: string): Promise<LessonEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { courseId } });
        return found.map((l) => this.toDomainEntity(l));
    }

    async findByCourseIdAndOrder(
        courseId: string,
        order: number,
    ): Promise<LessonEntity | null> {
        const found = await this.typeOrmRepo.findOne({
            where: { courseId, order },
        });
        return found ? this.toDomainEntity(found) : null;
    }

    async update(lesson: LessonEntity): Promise<LessonEntity> {
        const ormEntity = this.toOrmEntity(lesson);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async delete(id: string): Promise<void> {
        await this.typeOrmRepo.delete({ id });
    }

    // Transforma entidade ORM em entidade de domain
    private toDomainEntity(orm: LessonOrmEntity): LessonEntity {
        return new LessonEntity({
            id: orm.id,
            courseId: orm.courseId,
            title: orm.title,
            videoId: orm.videoId,
            summary: orm.summary,
            topics: orm.topics,
            order: orm.order,
            isPublished: orm.isPublished,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    // Transforma entidade de domain em entidade ORM
    private toOrmEntity(domain: LessonEntity): LessonOrmEntity {
        const orm = new LessonOrmEntity();

        if (domain.id) {
            orm.id = domain.id;
        }

        orm.courseId = domain.courseId;
        orm.title = domain.title;
        orm.videoId = domain.videoId;
        orm.summary = domain.summary!;
        orm.topics = domain.topics!;
        orm.order = domain.order;
        orm.isPublished = domain.isPublished;

        return orm;
    }
}
