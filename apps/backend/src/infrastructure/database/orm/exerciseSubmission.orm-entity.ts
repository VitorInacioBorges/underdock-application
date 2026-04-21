// Representação de cada coluna da tabela 'exercise_submissions' no banco
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
import { ExerciseOrmEntity } from './exercise.orm-entity';
import { ExerciseSubmissionStatus } from '../../../domain/entities/exerciseSubmission.entity';

@Entity('exercise_submissions') // Nome da tabela no banco
export class ExerciseSubmissionOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'exercise_id' })
    exerciseId: string;

    @ManyToOne(() => ExerciseOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exercise_id' })
    exercise: ExerciseOrmEntity;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserOrmEntity;

    @Column({ name: 'file_path' })
    filePath: string;

    @Column({
        type: 'enum',
        enum: ExerciseSubmissionStatus,
        default: ExerciseSubmissionStatus.pending,
    })
    status: ExerciseSubmissionStatus;

    @CreateDateColumn({ name: 'submitted_at' })
    submittedAt: Date;
}
