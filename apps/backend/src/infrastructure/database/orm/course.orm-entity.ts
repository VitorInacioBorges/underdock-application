// Representação de cada coluna da tabela 'courses' no banco
// Cada coluna tem suas propriedades unicas como: primary key, unique, date, boolean, type, name, etc.

import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('courses') // Nome da tabela no banco
export class CourseOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ name: 'is_published', default: false })
    isPublished: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
