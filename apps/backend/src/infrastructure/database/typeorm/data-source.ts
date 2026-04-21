import 'dotenv/config';
import { DataSource } from 'typeorm';
import { CourseOrmEntity } from '../orm/course.orm-entity';
import { EnrollmentOrmEntity } from '../orm/enrollment.orm-entity';
import { ExerciseOrmEntity } from '../orm/exercise.orm-entity';
import { ExerciseSubmissionOrmEntity } from '../orm/exerciseSubmission.orm-entity';
import { FeedbackOrmEntity } from '../orm/feedback.orm-entity';
import { LessonOrmEntity } from '../orm/lesson.orm-entity';
import { LessonProgressOrmEntity } from '../orm/lessonProgress.orm-entity';
import { UserOrmEntity } from '../orm/user.orm-entity';

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    // nunca use synchronize true se vai trabalhar com migration
    synchronize: false,

    entities: [
        CourseOrmEntity,
        EnrollmentOrmEntity,
        ExerciseOrmEntity,
        ExerciseSubmissionOrmEntity,
        FeedbackOrmEntity,
        LessonOrmEntity,
        LessonProgressOrmEntity,
        UserOrmEntity,
    ],

    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});