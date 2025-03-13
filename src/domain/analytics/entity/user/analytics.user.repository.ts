import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "src/domain/log/entity/log/log.entity";
import { IsNull, Not, Repository } from "typeorm";
import { UserAnalytics } from "./analytics.user.entity";

export class UserRepository {
  constructor(
    @InjectRepository(UserAnalytics) private readonly userRepository: Repository<UserAnalytics>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>
  ) {}

  //* User Analytics Table Insert Query
  public async UserAnalyticsInsert() {
    // Count
    const cntData = await this.logRepository
      .createQueryBuilder("log")
      .select("user_pk")
      .where({
        userPk: Not(IsNull()),
        logType: "login",
      })
      .getRawMany();

    // Insert
    Object.values(cntData).forEach(async (value) => {
      await this.userRepository
        .createQueryBuilder("UserAnalytics")
        .insert()
        .into("UserAnalytics")
        .values([{ userPk: value.user_pk }])
        .execute();
    });
  }
}
