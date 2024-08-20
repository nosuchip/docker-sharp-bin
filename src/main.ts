import "dotenv/config";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import multipart from "@fastify/multipart";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ["error", "warn", "log", "debug"],
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    })
  );

  await app.register(multipart);

  const swagger = new DocumentBuilder()
    .setTitle("Server")
    .setDescription("")
    .setVersion(`1.0.0`)
    .addTag("media")
    .addBearerAuth(
      {
        description: `Bearer <JWT>`,
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "access_token"
    )
    .build();
  const document = SwaggerModule.createDocument(app, swagger);

  SwaggerModule.setup("docs", app, document);

  const port = 9999;
  const host = "0.0.0.0";

  await app.listen(port, host);

  console.log(
    `Server running on the ${await app.getUrl()}, swagger on ${await app.getUrl()}/docs`
  );
}
bootstrap();
