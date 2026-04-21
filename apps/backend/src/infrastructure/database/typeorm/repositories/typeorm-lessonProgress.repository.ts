// Transforma entidades do domain em entidades de ORM para alteração e salvamento no banco e retorna como entidade do domain
// Transforma funções do repositório do domain em funções utilitárias do próprio ORM como:
// findByUserAndLesson() --> findOne({ where: { userId, lessonId } }), findByUserId() --> find({ where: { userId } })

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgressEntity } from '../../../../domain/entities/lessonProgress.entity';
import type { ILessonProgressRepository } from '../../../../domain/repositories/lessonProgress.repository';
import { LessonProgressOrmEntity } from '../../orm/lessonProgress.orm-entity';

@Injectable()
export class TypeOrmLessonProgressRepository
    implements ILessonProgressRepository {
    constructor(
        @InjectRepository(LessonProgressOrmEntity)
        private readonly typeOrmRepo: Repository<LessonProgressOrmEntity>,
    ) { }

    async create(progress: LessonProgressEntity): Promise<LessonProgressEntity> {
        const ormEntity = this.toOrmEntity(progress);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async findById(id: string): Promise<LessonProgressEntity | null> {
        const found = await this.typeOrmRepo.findOne({ where: { id } });
        return found ? this.toDomainEntity(found) : null;
    }

    async findByUserAndLesson(
        userId: string,
        lessonId: string,
    ): Promise<LessonProgressEntity | null> {
        const found = await this.typeOrmRepo.findOne({
            where: { userId, lessonId },
        });
        return found ? this.toDomainEntity(found) : null;
    }

    async findByUserId(userId: string): Promise<LessonProgressEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { userId } });
        return found.map((p) => this.toDomainEntity(p));
    }

    async update(progress: LessonProgressEntity): Promise<LessonProgressEntity> {
        const ormEntity = this.toOrmEntity(progress);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async delete(id: string): Promise<void> {
        await this.typeOrmRepo.delete({ id });
    }

    // Transforma entidade ORM em entidade de domain
    private toDomainEntity(orm: LessonProgressOrmEntity): LessonProgressEntity {
        return new LessonProgressEntity({
            id: orm.id,
            userId: orm.userId,
            lessonId: orm.lessonId,
            watched: orm.watched,
            watchedAt: orm.watchedAt,
        });
    }

    // Transforma entidade de domain em entidade ORM
    private toOrmEntity(domain: LessonProgressEntity): LessonProgressOrmEntity {
        const orm = new LessonProgressOrmEntity();

        if (domain.id) {
            orm.id = domain.id;
        }

        orm.userId = domain.userId;
        orm.lessonId = domain.lessonId;
        orm.watched = domain.watched;

        return orm;
    }
}
