import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "src/domain/log/entity/log/log.entity";
import { Repository } from "typeorm";
import { LoginAnalytics } from "./analytics.login.entity";

export class LoginRepository {
  constructor(
    @InjectRepository(LoginAnalytics) private readonly loginRepository: Repository<LoginAnalytics>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>
  ) {}

  //* Login Analytics Table Insert Query
  public async LoginAnalyticsInsert() {
    // Count
    const cntData = await this.logRepository.createQueryBuilder("log").select("logId").where(`log.logType LIKE :logType`, { logType: `%login%` }).getCount();

    // Insert
    await this.loginRepository
      .createQueryBuilder("LoginAnalytics")
      .insert()
      .into("LoginAnalytics")
      .values([{ value: cntData }])
      .execute();
  }
}
