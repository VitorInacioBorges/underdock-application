// Transforma entidades do domain em entidades de ORM para alteração e salvamento no banco e retorna como entidade do domain
// Transforma funções do repositório do domain em funções utilitárias do próprio ORM como:
// findBySubmissionId() --> findOne({ where: { submissionId } }), findByInstructorId() --> find({ where: { instructorId } })

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackEntity } from '../../../../domain/entities/feedback.entity';
import type { IFeedbackRepository } from '../../../../domain/repositories/feedback.repository';
import { FeedbackOrmEntity } from '../../orm/feedback.orm-entity';

@Injectable()
export class TypeOrmFeedbackRepository implements IFeedbackRepository {
    constructor(
        @InjectRepository(FeedbackOrmEntity)
        private readonly typeOrmRepo: Repository<FeedbackOrmEntity>,
    ) { }

    async create(feedback: FeedbackEntity): Promise<FeedbackEntity> {
        const ormEntity = this.toOrmEntity(feedback);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async findById(id: string): Promise<FeedbackEntity | null> {
        const found = await this.typeOrmRepo.findOne({ where: { id } });
        return found ? this.toDomainEntity(found) : null;
    }

    async findBySubmissionId(
        submissionId: string,
    ): Promise<FeedbackEntity | null> {
        const found = await this.typeOrmRepo.findOne({ where: { submissionId } });
        return found ? this.toDomainEntity(found) : null;
    }

    async findByInstructorId(instructorId: string): Promise<FeedbackEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { instructorId } });
        return found.map((f) => this.toDomainEntity(f));
    }

    async update(feedback: FeedbackEntity): Promise<FeedbackEntity> {
        const ormEntity = this.toOrmEntity(feedback);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async delete(id: string): Promise<void> {
        await this.typeOrmRepo.delete({ id });
    }

    // Transforma entidade ORM em entidade de domain
    private toDomainEntity(orm: FeedbackOrmEntity): FeedbackEntity {
        return new FeedbackEntity({
            id: orm.id,
            submissionId: orm.submissionId,
            instructorId: orm.instructorId,
            comment: orm.comment,
            grade: orm.grade ?? undefined,
            createdAt: orm.createdAt,
        });
    }

    // Transforma entidade de domain em entidade ORM
    private toOrmEntity(domain: FeedbackEntity): FeedbackOrmEntity {
        const orm = new FeedbackOrmEntity();

        if (domain.id) {
            orm.id = domain.id;
        }

        orm.submissionId = domain.submissionId;
        orm.instructorId = domain.instructorId;
        orm.comment = domain.comment;
        orm.grade = domain.grade ?? null;

        return orm;
    }
}
