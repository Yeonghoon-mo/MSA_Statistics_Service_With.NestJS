import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogController } from "./controller/log.controller";
import { Log } from "./entity/log/log.entity";
import { LogRepository } from "./entity/log/log.repository";
import { Login } from "./entity/login/login.entity";
import { LoginRepository } from "./entity/login/login.repository";
import { LogService } from "./service/log/log.service";

@Module({
  imports: [TypeOrmModule.forFeature([Log, Login])],
  controllers: [LogController],
  providers: [LogService, LogRepository, LoginRepository],
  exports: [LogService, LogRepository, LoginRepository],
})
export class LogModule {}
