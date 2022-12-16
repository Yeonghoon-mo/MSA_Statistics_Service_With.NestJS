import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnalyticsModule } from "../analytics/analytics.module";
import { LogModule } from "./../log/log.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mariadb",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [], //* 만들 테이블 List (각 module에서 feture하는 부분에 작성됨)
      synchronize: false, //! 테이블이 생성되면 그 이후로는 무조건 False
      autoLoadEntities: true, //* 엔티티 자동 로드 (?)
      logging: true, //* 로그 출력
    }),
    ScheduleModule.forRoot(),
    LogModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
