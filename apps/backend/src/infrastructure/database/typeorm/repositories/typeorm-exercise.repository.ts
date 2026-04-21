// Transforma entidades do domain em entidades de ORM para alteração e salvamento no banco e retorna como entidade do domain
// Transforma funções do repositório do domain em funções utilitárias do próprio ORM como:
// findByLessonId() --> find({ where: { lessonId } })

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseEntity } from '../../../../domain/entities/exercise.entity';
import type { IExerciseRepository } from '../../../../domain/repositories/exercise.repository';
import { ExerciseOrmEntity } from '../../orm/exercise.orm-entity';

@Injectable()
export class TypeOrmExerciseRepository implements IExerciseRepository {
    constructor(
        @InjectRepository(ExerciseOrmEntity)
        private readonly typeOrmRepo: Repository<ExerciseOrmEntity>,
    ) { }

    async create(exercise: ExerciseEntity): Promise<ExerciseEntity> {
        const ormEntity = this.toOrmEntity(exercise);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async findById(id: string): Promise<ExerciseEntity | null> {
        const found = await this.typeOrmRepo.findOne({ where: { id } });
        return found ? this.toDomainEntity(found) : null;
    }

    async findByLessonId(lessonId: string): Promise<ExerciseEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { lessonId } });
        return found.map((e) => this.toDomainEntity(e));
    }

    async update(exercise: ExerciseEntity): Promise<ExerciseEntity> {
        const ormEntity = this.toOrmEntity(exercise);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async delete(id: string): Promise<void> {
        await this.typeOrmRepo.delete({ id });
    }

    // Transforma entidade ORM em entidade de domain
    private toDomainEntity(orm: ExerciseOrmEntity): ExerciseEntity {
        return new ExerciseEntity({
            id: orm.id,
            lessonId: orm.lessonId,
            title: orm.title,
            description: orm.description,
            notebookPath: orm.notebookPath,
            notebookFileName: orm.notebookFileName,
            notebookMimeType: orm.notebookMimeType,
            notebookSize: orm.notebookSize,
            createdAt: orm.createdAt,
        });
    }

    // Transforma entidade de domain em entidade ORM
    private toOrmEntity(domain: ExerciseEntity): ExerciseOrmEntity {
        const orm = new ExerciseOrmEntity();

        if (domain.id) {
            orm.id = domain.id;
        }

        orm.lessonId = domain.lessonId;
        orm.title = domain.title;
        orm.description = domain.description;
        orm.notebookPath = domain.notebookPath;
        orm.notebookFileName = domain.notebookFileName;
        orm.notebookMimeType = domain.notebookMimeType;
        orm.notebookSize = domain.notebookSize;

        return orm;
    }
}
