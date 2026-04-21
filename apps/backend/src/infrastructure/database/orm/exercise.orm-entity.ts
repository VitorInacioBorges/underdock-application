// Representação de cada coluna da tabela 'exercises' no banco
// Cada coluna tem suas propriedades unicas como: primary key, foreign key, date, type, name, etc.

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonOrmEntity } from './lesson.orm-entity';

@Entity('exercises') // Nome da tabela no banco
export class ExerciseOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'lesson_id' })
    lessonId: string;

    @ManyToOne(() => LessonOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_id' })
    lesson: LessonOrmEntity;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ name: 'notebook_path', type: 'varchar', nullable: true })
    notebookPath: string | null;

    @Column({ name: 'notebook_file_name', type: 'varchar', nullable: true })
    notebookFileName: string | null;

    @Column({ name: 'notebook_mime_type', type: 'varchar', nullable: true })
    notebookMimeType: string | null;

    @Column({ name: 'notebook_size', type: 'int', nullable: true })
    notebookSize: number | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
