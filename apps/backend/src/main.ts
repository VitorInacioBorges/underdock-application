import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Cria a instância da aplicação com NestJS
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true })); // Habilita validação via DTOs
  app.setGlobalPrefix('api'); // api = prefixo das rotas backend
  app.enableCors(); // Habilita CORS para permitir requisições do frontend
  await app.listen(process.env.PORT ?? 4000); // Inicia o servidor na porta 4000 ou na porta definida no .env
  console.log(`Server is running on port ${process.env.PORT ?? 4000}`); // Loga a porta em que o servidor está rodando via console
}

bootstrap();
