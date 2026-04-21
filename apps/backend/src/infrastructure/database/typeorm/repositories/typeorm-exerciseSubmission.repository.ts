// Transforma entidades do domain em entidades de ORM para alteração e salvamento no banco e retorna como entidade do domain
// Transforma funções do repositório do domain em funções utilitárias do próprio ORM como:
// findByUserAndExercise() --> findOne({ where: { userId, exerciseId } }), findByStatus() --> find({ where: { status } })

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    ExerciseSubmissionEntity,
    ExerciseSubmissionStatus,
} from '../../../../domain/entities/exerciseSubmission.entity';
import type { IExerciseSubmissionRepository } from '../../../../domain/repositories/exerciseSubmission';
import { ExerciseSubmissionOrmEntity } from '../../orm/exerciseSubmission.orm-entity';

@Injectable()
export class TypeOrmExerciseSubmissionRepository
    implements IExerciseSubmissionRepository {
    constructor(
        @InjectRepository(ExerciseSubmissionOrmEntity)
        private readonly typeOrmRepo: Repository<ExerciseSubmissionOrmEntity>,
    ) { }

    async create(
        submission: ExerciseSubmissionEntity,
    ): Promise<ExerciseSubmissionEntity> {
        const ormEntity = this.toOrmEntity(submission);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async findById(id: string): Promise<ExerciseSubmissionEntity | null> {
        const found = await this.typeOrmRepo.findOne({ where: { id } });
        return found ? this.toDomainEntity(found) : null;
    }

    async findByExerciseId(
        exerciseId: string,
    ): Promise<ExerciseSubmissionEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { exerciseId } });
        return found.map((s) => this.toDomainEntity(s));
    }

    async findByUserId(userId: string): Promise<ExerciseSubmissionEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { userId } });
        return found.map((s) => this.toDomainEntity(s));
    }

    async findByUserAndExercise(
        userId: string,
        exerciseId: string,
    ): Promise<ExerciseSubmissionEntity | null> {
        const found = await this.typeOrmRepo.findOne({
            where: { userId, exerciseId },
        });
        return found ? this.toDomainEntity(found) : null;
    }

    async findByStatus(
        status: ExerciseSubmissionStatus,
    ): Promise<ExerciseSubmissionEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { status } });
        return found.map((s) => this.toDomainEntity(s));
    }

    async update(
        submission: ExerciseSubmissionEntity,
    ): Promise<ExerciseSubmissionEntity> {
        const ormEntity = this.toOrmEntity(submission);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async delete(id: string): Promise<void> {
        await this.typeOrmRepo.delete({ id });
    }

    // Transforma entidade ORM em entidade de domain
    private toDomainEntity(
        orm: ExerciseSubmissionOrmEntity,
    ): ExerciseSubmissionEntity {
        return new ExerciseSubmissionEntity({
            id: orm.id,
            exerciseId: orm.exerciseId,
            userId: orm.userId,
            filePath: orm.filePath,
            status: orm.status,
            submittedAt: orm.submittedAt,
        });
    }

    // Transforma entidade de domain em entidade ORM
    private toOrmEntity(
        domain: ExerciseSubmissionEntity,
    ): ExerciseSubmissionOrmEntity {
        const orm = new ExerciseSubmissionOrmEntity();

        if (domain.id) {
            orm.id = domain.id;
        }

        orm.exerciseId = domain.exerciseId;
        orm.userId = domain.userId;
        orm.filePath = domain.filePath;
        orm.status = domain.status;

        return orm;
    }
}
