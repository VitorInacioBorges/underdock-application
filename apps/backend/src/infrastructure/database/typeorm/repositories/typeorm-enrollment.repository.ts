// Transforma entidades do domain em entidades de ORM para alteração e salvamento no banco e retorna como entidade do domain
// Transforma funções do repositório do domain em funções utilitárias do próprio ORM como:
// findByUserAndCourse() --> findOne({ where: { userId, courseId } })

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment.entity';
import type { IEnrollmentRepository } from '../../../../domain/repositories/enrollment.repository';
import { EnrollmentOrmEntity } from '../../orm/enrollment.orm-entity';

@Injectable()
export class TypeOrmEnrollmentRepository implements IEnrollmentRepository {
    constructor(
        @InjectRepository(EnrollmentOrmEntity)
        private readonly typeOrmRepo: Repository<EnrollmentOrmEntity>,
    ) { }

    async create(enrollment: EnrollmentEntity): Promise<EnrollmentEntity> {
        const ormEntity = this.toOrmEntity(enrollment);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async findById(id: string): Promise<EnrollmentEntity | null> {
        const found = await this.typeOrmRepo.findOne({ where: { id } });
        return found ? this.toDomainEntity(found) : null;
    }

    async findByUserId(userId: string): Promise<EnrollmentEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { userId } });
        return found.map((e) => this.toDomainEntity(e));
    }

    async findByUserIdAndCourseId(userId: string, courseId: string): Promise<EnrollmentEntity[]> {
        const rows = await this.typeOrmRepo.find({
            where: {
                userId: userId,
                courseId: courseId,
            },
        });

        return rows.map((row) => this.toDomainEntity(row));
    }

    async findByCourseId(courseId: string): Promise<EnrollmentEntity[]> {
        const found = await this.typeOrmRepo.find({ where: { courseId } });
        return found.map((e) => this.toDomainEntity(e));
    }

    async findByUserAndCourse(
        userId: string,
        courseId: string,
    ): Promise<EnrollmentEntity | null> {
        const found = await this.typeOrmRepo.findOne({
            where: { userId, courseId },
        });
        return found ? this.toDomainEntity(found) : null;
    }

    async update(enrollment: EnrollmentEntity): Promise<EnrollmentEntity> {
        const ormEntity = this.toOrmEntity(enrollment);
        const saved = await this.typeOrmRepo.save(ormEntity);
        return this.toDomainEntity(saved);
    }

    async delete(id: string): Promise<void> {
        await this.typeOrmRepo.delete({ id });
    }

    // Transforma entidade ORM em entidade de domain
    private toDomainEntity(orm: EnrollmentOrmEntity): EnrollmentEntity {
        return new EnrollmentEntity({
            id: orm.id,
            userId: orm.userId,
            courseId: orm.courseId,
            role: orm.role,
            status: orm.status,
            enrolledAt: orm.enrolledAt,
        });
    }

    // Transforma entidade de domain em entidade ORM
    private toOrmEntity(domain: EnrollmentEntity): EnrollmentOrmEntity {
        const orm = new EnrollmentOrmEntity();

        if (domain.id) {
            orm.id = domain.id;
        }

        orm.userId = domain.userId;
        orm.courseId = domain.courseId;
        orm.role = domain.role;
        orm.status = domain.status;

        return orm;
    }
}
