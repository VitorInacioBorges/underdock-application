// Representação de cada coluna da tabela 'enrollments' no banco
// Cada coluna tem suas propriedades unicas como: primary key, foreign key, date, enum, type, name, etc.

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { CourseOrmEntity } from './course.orm-entity';
import {
    EnrollmentRole,
    EnrollmentStatus,
} from '../../../domain/entities/enrollment.entity';

@Entity('enrollments') // Nome da tabela no banco
export class EnrollmentOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserOrmEntity;

    @Column({ name: 'course_id' })
    courseId: string;

    @ManyToOne(() => CourseOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: CourseOrmEntity;

    @Column({ type: 'enum', enum: EnrollmentRole })
    role: EnrollmentRole;

    @Column({ type: 'enum', enum: EnrollmentStatus })
    status: EnrollmentStatus;

    @CreateDateColumn({ name: 'enrolled_at' })
    enrolledAt: Date;
}
