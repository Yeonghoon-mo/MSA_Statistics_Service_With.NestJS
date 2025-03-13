import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "src/domain/log/entity/log/log.entity";
import { Repository } from "typeorm";
import { SignupAnalytics } from "./analytics.signup.entity";

export class SignupRepository {
  constructor(
    @InjectRepository(SignupAnalytics) private readonly signupRepository: Repository<SignupAnalytics>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>
  ) {}

  //* Signup Analytics Table Insert Query
  public async SignupAnalyticsInsert() {
    // Count
    const cntData = await this.logRepository.createQueryBuilder("log").select("logId").where(`log.logType LIKE :logType`, { logType: `%signup%` }).getCount();

    // Insert
    await this.signupRepository
      .createQueryBuilder("SignupAnalytics")
      .insert()
      .into("SignupAnalytics")
      .values([{ value: cntData }])
      .execute();
  }
}
