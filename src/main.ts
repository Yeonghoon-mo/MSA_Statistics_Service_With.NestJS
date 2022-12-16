import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * Swagger Setting
  const config = new DocumentBuilder().setTitle("Statistics MSA").setDescription("The Statistics API Description").setVersion("1.1.0").build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  
  if (process.env.NODE_ENV !== "production") {
    SwaggerModule.setup("api", app, document);
  }

  await app.listen(3030);
}

bootstrap();
