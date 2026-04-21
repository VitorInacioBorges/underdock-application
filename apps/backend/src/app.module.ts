import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './modules/course.module';
import { EnrollmentModule } from './modules/enrollment.module';
import { ExerciseModule } from './modules/exercise.module';
import { ExerciseSubmissionModule } from './modules/exerciseSubmission.module';
import { FeedbackModule } from './modules/feedback.module';
import { LessonModule } from './modules/lesson.module';
import { LessonProgressModule } from './modules/lessonProgress.module';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    UserModule,
    CourseModule,
    EnrollmentModule,
    ExerciseModule,
    ExerciseSubmissionModule,
    FeedbackModule,
    LessonModule,
    LessonProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }