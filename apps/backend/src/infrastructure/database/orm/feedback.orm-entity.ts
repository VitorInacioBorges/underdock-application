// Representação de cada coluna da tabela 'feedbacks' no banco
// Cada coluna tem suas propriedades unicas como: primary key, foreign key, date, nullable, type, name, etc.

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { ExerciseSubmissionOrmEntity } from './exerciseSubmission.orm-entity';

@Entity('feedbacks') // Nome da tabela no banco
export class FeedbackOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'submission_id' })
    submissionId: string;

    @ManyToOne(() => ExerciseSubmissionOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'submission_id' })
    submission: ExerciseSubmissionOrmEntity;

    @Column({ name: 'instructor_id' })
    instructorId: string;

    @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'instructor_id' })
    instructor: UserOrmEntity;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'float', nullable: true })
    grade: number | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
