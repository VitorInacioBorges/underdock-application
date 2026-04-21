import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString({ message: 'O título deve ser um texto.' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto.' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'O status de publicação deve ser um valor booleano.' })
  isPublished?: boolean;
}

// Informação para a Requisição

/*
    {
        "title": "Curso de NestJS Avançado",
        "isPublished": true
    }
*/
