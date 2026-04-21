import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    MinLength,
} from 'class-validator';

export class CreateLessonDto {
    @IsUUID('4', { message: 'O ID do curso informado é inválido' })
    @IsNotEmpty({ message: 'O ID do curso é obrigatório' })
    courseId: string;

    @IsString({ message: 'O título deve ser um texto.' })
    @IsNotEmpty({ message: 'O título é obrigatório.' })
    @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
    title: string;

    @IsString({ message: 'O ID do vídeo deve ser um texto.' })
    @IsNotEmpty({ message: 'O ID do vídeo é obrigatório.' })
    videoId: string;

    @IsInt({ message: 'A ordem deve ser um número inteiro.' })
    @Min(1, { message: 'A ordem deve ser no mínimo 1.' })
    order: number;

    @IsOptional()
    @IsBoolean({ message: 'isPublished deve ser um booleano.' })
    isPublished?: boolean;

    @IsOptional()
    @IsString({ message: 'O resumo deve ser um texto.' })
    summary?: string;

    @IsOptional()
    @IsString({ each: true, message: 'Cada tópico deve ser um texto.' })
    topics?: string[];

}

// Informação para a Requisição

/*
    {
        "courseId": "987e6543-e21b-12d3-a456-426614174111",
        "title": "Introdução ao NestJS",
        "videoId": "dQw4w9WgXcQ",
        "order": 1,
        "isPublished": true
    }
*/
