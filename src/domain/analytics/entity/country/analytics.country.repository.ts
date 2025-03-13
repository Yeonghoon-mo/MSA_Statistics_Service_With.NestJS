import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "src/domain/log/entity/log/log.entity";
import { Repository } from "typeorm";
import { CountryAnalytics } from "./analytics.country.entity";

export class CountryRepository {
  constructor(
    @InjectRepository(CountryAnalytics) private readonly countryRepository: Repository<CountryAnalytics>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>
  ) {}

  //* Country Analytics Table Insert Query
  public async CountryAnalyticsInsert() {
    // Count
    const cntData = await this.logRepository
      .createQueryBuilder("log")
      .select("log.countryName")
      .addSelect("COUNT(log.countryName)", "Count")
      .where(`log.logType LIKE :logType`, { logType: `login` })
      .groupBy("log.countryName")
      .getRawMany();

    // * forEach Insert
    Object.values(cntData).forEach(async (value) => {
      await this.countryRepository
        .createQueryBuilder("CountryAnalytics")
        .insert()
        .into("CountryAnalytics")
        .values([
          {
            countryName: value.log_country_name,
            value: value.Count,
          },
        ])
        .execute();
    });

    // * for Insert
    // for (let i = 0; i < cntData.length; i++) {
    //   await this.countryRepository
    //     .createQueryBuilder("CountryAnalytics")
    //     .insert()
    //     .into("CountryAnalytics")
    //     .values([
    //       {
    //         countryName: Object.values(cntData)[i].log_country_name,
    //         value: Object.values(cntData)[i].Count,
    //       },
    //     ])
    //     .execute();
    // }
  }
}
