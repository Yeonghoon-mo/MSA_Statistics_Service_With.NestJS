import { HttpException, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as dayjs from "dayjs";
import { TYPE } from "src/enum/enum";
import { LogRepository } from "src/log/entity/log/log.repository";
import {
  FindAllAvgRequest,
  FindAllSumRequest, FindOneAvgRequest,
  FindOneSumRequest,
  FindUserRequest,
  FindUserUnusedRequest
} from "../DTO/analytics.dto";
import { AnalyticsRepository } from "../entity/analytics.repository";
import { CountryRepository } from "../entity/country/analytics.country.repository";
import { LoginRepository } from "../entity/login/analytics.login.repository";
import { SecessionRepository } from "../entity/secession/analytics.secession.repository";
import { SignupRepository } from "../entity/signup/analytics.signup.repository";
import { UserRepository } from "../entity/user/analytics.user.repository";

@Injectable()
export class AnalyticsService {
  constructor(
    private analyticsRepository: AnalyticsRepository,
    private signupRepository: SignupRepository,
    private secessionRepository: SecessionRepository,
    private loginRepository: LoginRepository,
    private logRepository: LogRepository,
    private countryRepository: CountryRepository,
    private userRepository: UserRepository
  ) {}

  //* 전체 통계 기간별 합계
  async findBySumAll(analyticsRequest: FindAllSumRequest) {
    this.customExcepiton(analyticsRequest);
    this.timePlus(analyticsRequest);

    return this.analyticsRepository.findBySumAll(analyticsRequest);
  }

  //* 전체 통계 기간별 평균
  async findByAvgAll(analyticsAvgRequest: FindAllAvgRequest) {
    this.customExcepiton(analyticsAvgRequest);
    this.timePlus(analyticsAvgRequest);

    return this.analyticsRepository.findByAvgAll(analyticsAvgRequest);
  }

  //* 각 통계 기간별 합계
  async findBySum(analyticsRequest: FindOneSumRequest) {
    this.customExcepiton(analyticsRequest);
    this.timePlus(analyticsRequest);

    return this.analyticsRepository.findBySum(analyticsRequest);
  }

  //* 각 통계 기간별 평균
  async findByAvg(analyticsAvgRequest: FindOneAvgRequest) {
    this.customExcepiton(analyticsAvgRequest);
    this.timePlus(analyticsAvgRequest);

    if (analyticsAvgRequest.avgIf === undefined) {
      throw new HttpException("평균 조건 날짜를 입력해주세요.. (ex: y)", 403);
    }

    return this.analyticsRepository.findByAvg(analyticsAvgRequest);
  }

  //* 유저의 기간 별 누적 접속 횟수
  async findByUserUsed(analyticsRequest: FindUserRequest) {
    this.timePlus(analyticsRequest);
    return this.analyticsRepository.findByUserUsed(analyticsRequest);
  }

  //* 유저가 접속을 얼마나 하지 않았는지
  async findByUserUnused(analyticsRequest: FindUserUnusedRequest) {
    this.timePlus(analyticsRequest);
    return this.analyticsRepository.findByUserUnused(analyticsRequest);
  }

  //* 전체 유저의 기간 별 누적 접속 횟수
  async findAllUserUsed(analyticsRequest) {
    this.timePlus(analyticsRequest);
    return this.analyticsRepository.findAllUserUsed(analyticsRequest);
  }

  //* AnalyticsDB Insert Scheduler
  @Cron("0 0 0 * * *") // 매일 0시 0분 0초마다 실행.
  async batchInsert(): Promise<void> {
    // 로그인 Log Analytics Insert
    await this.signupRepository.SignupAnalyticsInsert();
    // 탈퇴 Log Analytics Insert
    await this.secessionRepository.SecessionAnalyticsInsert();
    // 로그인 Log Analytics Insert
    await this.loginRepository.LoginAnalyticsInsert();
    // 국가별 로그인 횟수 Log Analytics Insert
    await this.countryRepository.CountryAnalyticsInsert();
    // 해당 유저 로그인 횟수 Log Analytics Insert
    await this.userRepository.UserAnalyticsInsert();
    // Log Table Delete
    await this.logRepository.deleteLogTable();
  }

  // 예외처리
  public customExcepiton(analyticsRequest: any) {
    const value = TYPE[analyticsRequest.contains];

    if (value === TYPE.COUNTRY) {
      if (analyticsRequest.countryName === undefined) {
        throw new HttpException("나라 이름을 입력해주세요. (ex: KR)", 403);
      }
    }

    if (analyticsRequest.firstDate.length !== 10 || analyticsRequest.lastDate.length !== 10) {
      throw new HttpException("날짜 데이터 형식을 확인해주세요. (ex: YYYY-MM-DD) ", 403);
    }

    if (dayjs(analyticsRequest.lastDate).isBefore(analyticsRequest.firstDate)) {
      throw new HttpException("firstDate의 값이 lastDate의 값보다 높습니다. 형식을 확인해주세요 :)", 403);
    }
  }

  // 해당 날짜의 마지막 시간을 설정하는 Method
  public timePlus(analytics: any) {
    analytics.lastDate = dayjs(analytics.lastDate).add(23, "h").format();
    analytics.lastDate = dayjs(analytics.lastDate).add(59, "m").format();
    analytics.lastDate = dayjs(analytics.lastDate).add(59, "s").format();
    analytics.lastDate = dayjs(analytics.lastDate).add(999, "ms").format();
  }
}
