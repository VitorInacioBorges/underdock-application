// Representação de cada coluna da tabela 'lesson_progress' no banco
// Cada coluna tem suas propriedades unicas como: primary key, foreign key, date, boolean, type, name, etc.

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { LessonOrmEntity } from './lesson.orm-entity';

@Entity('lesson_progress') // Nome da tabela no banco
export class LessonProgressOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserOrmEntity;

    @Column({ name: 'lesson_id' })
    lessonId: string;

    @ManyToOne(() => LessonOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_id' })
    lesson: LessonOrmEntity;

    @Column({ default: false })
    watched: boolean;

    @CreateDateColumn({ name: 'watched_at' })
    watchedAt: Date;
}
