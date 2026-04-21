import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString({ message: 'O título deve ser um texto.' })
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
  title: string;

  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description: string;
}

// Informação para a Requisição

/*
    {
        "title": "Curso de NestJS",
        "description": "Aprenda a construir APIs robustas com Node.js e TypeScript."
    }
*/
