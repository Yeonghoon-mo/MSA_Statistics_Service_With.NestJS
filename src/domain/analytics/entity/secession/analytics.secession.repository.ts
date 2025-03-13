import { InjectRepository } from "@nestjs/typeorm"; // Nest.js에서 제공하는 TypeORM Repository 주입 데코레이터
import { Log } from "src/log/entity/log/log.entity"; // Log 엔티티 클래스
import { Repository } from "typeorm"; // TypeORM의 Repository 클래스
import { SecessionAnalytics } from "./analytics.secession.entity"; // SecessionAnalytics 엔티티 클래스

export class SecessionRepository {
  constructor(
    @InjectRepository(SecessionAnalytics) // SecessionAnalytics Repository 주입
    private readonly secessionRepository: Repository<SecessionAnalytics>,
    @InjectRepository(Log) // Log Repository 주입
    private readonly logRepository: Repository<Log>
  ) {}

  // SecessionAnalytics 테이블에 데이터 삽입하는 메서드
  public async SecessionAnalyticsInsert() {
    // Count: Log 테이블에서 secession이 포함된 로그의 개수를 가져옴
    const cntData = await this.logRepository
      .createQueryBuilder("log")
      .select("log.logId")
      .where(`log.logType LIKE :logType`, { logType: `%secession%` })
      .getCount();

    // Insert: SecessionAnalytics 테이블에 secession 로그의 개수를 삽입
    await this.secessionRepository
      .createQueryBuilder("SecessionAnalytics")
      .insert()
      .into("SecessionAnalytics")
      .values([{ value: cntData }])
      .execute();
  }
}
