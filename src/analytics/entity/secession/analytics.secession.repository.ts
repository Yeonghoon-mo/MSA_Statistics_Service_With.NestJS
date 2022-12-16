import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "src/log/entity/log/log.entity";
import { Repository } from "typeorm";
import { SecessionAnalytics } from "./analytics.secession.entity";

export class SecessionRepository {
  constructor(
    @InjectRepository(SecessionAnalytics) private readonly secessionRepository: Repository<SecessionAnalytics>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>
  ) {}

  //* Secession Analytics Table Insert Query
  public async SecessionAnalyticsInsert() {
    // Count
    const cntData = await this.logRepository.createQueryBuilder("log").select("logId").where(`log.logType LIKE :logType`, { logType: `%secession%` }).getCount();

    // Insert
    await this.secessionRepository
      .createQueryBuilder("SecessionAnalytics")
      .insert()
      .into("SecessionAnalytics")
      .values([{ value: cntData }])
      .execute();
  }
}
