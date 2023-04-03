import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LogRequest } from "src/log/DTO/log.dto";
import { Repository } from "typeorm";
import { Log } from "./log.entity";

@Injectable()
export class LogRepository {
  constructor(@InjectRepository(Log) private readonly logRepository: Repository<Log>) {}

  //* 저장
  public async save(logRequest: LogRequest) {
    const data: any = { ...logRequest };
    if (data?.id) delete data.id;

    return await this.logRepository.save(data);
  }

  //* Log Table 사용자 ID 찾기
  public async findByUserId(userPk: string) {
    return await this.logRepository.findOne({ where: { userPk, logType: "login" } });
  }

  //* 로그 테이블 데이터 삭제
  public async deleteLogTable() {
    this.logRepository.createQueryBuilder("Log").delete().from("Log").execute();
  }
}
