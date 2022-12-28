import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "src/log/entity/log/log.entity";
import { LogRepository } from "src/log/entity/log/log.repository";
import { Login } from "src/log/entity/login/login.entity";
import { AnalyticsController } from "./controller/analytics.controller";
import { AnalyticsRepository } from "./entity/analytics.repository";
import { CountryAnalytics } from "./entity/country/analytics.country.entity";
import { CountryRepository } from "./entity/country/analytics.country.repository";
import { LoginAnalytics } from "./entity/login/analytics.login.entity";
import { LoginRepository } from "./entity/login/analytics.login.repository";
import { SecessionAnalytics } from "./entity/secession/analytics.secession.entity";
import { SecessionRepository } from "./entity/secession/analytics.secession.repository";
import { SignupAnalytics } from "./entity/signup/analytics.signup.entity";
import { SignupRepository } from "./entity/signup/analytics.signup.repository";
import { UserAnalytics } from "./entity/user/analytics.user.entity";
import { UserRepository } from "./entity/user/analytics.user.repository";
import { AnalyticsService } from "./service/analytics.service";

@Module({
  imports: [TypeOrmModule.forFeature([SignupAnalytics, SecessionAnalytics, LoginAnalytics, CountryAnalytics, UserAnalytics, Log, Login])],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    SignupRepository,
    SecessionRepository,
    LoginRepository,
    AnalyticsRepository,
    LogRepository,
    CountryRepository,
    UserRepository,
    LoginRepository,
    //Test
  ],
})
export class AnalyticsModule {}
