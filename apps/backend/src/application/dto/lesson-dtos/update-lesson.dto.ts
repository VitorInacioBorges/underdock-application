import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
    MinLength,
} from 'class-validator';

export class UpdateLessonDto {
    @IsOptional()
    @IsString({ message: 'O título deve ser um texto.' })
    @IsNotEmpty({ message: 'O título não pode ser vazio.' })
    @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
    title?: string;

    @IsOptional()
    @IsString({ message: 'O ID do vídeo deve ser um texto.' })
    @IsNotEmpty({ message: 'O ID do vídeo não pode ser vazio.' })
    videoId?: string;

    @IsOptional()
    @IsInt({ message: 'A ordem deve ser um número inteiro.' })
    @Min(1, { message: 'A ordem deve ser no mínimo 1.' })
    order?: number;

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
        "title": "Introdução ao NestJS - Atualizado",
        "isPublished": false
    }
*/
