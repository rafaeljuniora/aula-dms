import { NestFactory } from "@nestjs/core";
import { Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HateoasInterceptor } from "@shared/infra/hateoas";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("v1");

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new HateoasInterceptor(reflector));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("School Control API")
    .setDescription("API de autenticacao e usuarios")
    .setVersion("1.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, swaggerDocument);

  await app.listen(process.env.PORT!);
}

void bootstrap();
