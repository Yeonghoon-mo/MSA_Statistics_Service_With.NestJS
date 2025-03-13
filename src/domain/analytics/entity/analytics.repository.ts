import { HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { TYPE, TYPEIF } from "src/enum/enum";
import { Repository } from "typeorm";
import {
  FindAllAvgRequest,
  FindAllSumRequest,
  FindAllUserRequest,
  FindOneAvgRequest,
  FindOneSumRequest,
  FindUserRequest,
  FindUserUnusedRequest,
} from "../DTO/analytics.dto";
import { CountryAnalytics } from "./country/analytics.country.entity";
import { LoginAnalytics } from "./login/analytics.login.entity";
import { SecessionAnalytics } from "./secession/analytics.secession.entity";
import { SignupAnalytics } from "./signup/analytics.signup.entity";
import { UserAnalytics } from "./user/analytics.user.entity";
import { Login } from "src/domain/log/entity/login/login.entity";

export class AnalyticsRepository {
  constructor(
    @InjectRepository(SignupAnalytics) private readonly signupRepository: Repository<SignupAnalytics>,
    @InjectRepository(SecessionAnalytics) private readonly secessionRepository: Repository<SecessionAnalytics>,
    @InjectRepository(CountryAnalytics) private readonly countryRepository: Repository<CountryAnalytics>,
    @InjectRepository(LoginAnalytics) private readonly loginRepository: Repository<LoginAnalytics>,
    @InjectRepository(UserAnalytics) private readonly userRepository: Repository<UserAnalytics>,
    @InjectRepository(Login) private readonly loginLogRepository: Repository<Login>
  ) {}

  //* 공통 Query
  private commonQuery(repository: any, type: string, analyticsRequest: any) {
    return repository
      .createQueryBuilder(type)
      .select(`SUM(${type}.value)`, `${type}`)
      .where(`${type}.createdDate >= :firstDate`, { firstDate: `${analyticsRequest.firstDate}` })
      .andWhere(`${type}.createdDate <= :lastDate`, { lastDate: `${analyticsRequest.lastDate}` });
  }

  //* 전체 통계 기간별 합계
  public findBySumAll(analyticsRequest: FindAllSumRequest) {
    const data = [];

    Object.keys(TYPE).forEach((key, i) => {
      analyticsRequest.contains = key;
      const type = this.functionType(analyticsRequest);
      const repository = this.functionRepo({ contains: TYPE[key] });
      if (type === "CountryAnalytics") {
        data.push(
          this.commonQuery(repository, type, analyticsRequest)
            .andWhere(`${type}.countryName LIKE :countryName`, { countryName: `${analyticsRequest.countryName}` })
            .getRawOne()
        );
      } else {
        data.push(this.commonQuery(repository, type, analyticsRequest).getRawOne());
      }
    });

    return Promise.all(data);
  }

  //* 전체 통계 기간별 평균
  public async findByAvgAll(analyticsAvgRequest: FindAllAvgRequest) {
    const data = [];

    let dateDifference: number = dayjs(analyticsAvgRequest.lastDate).diff(dayjs(analyticsAvgRequest.firstDate), analyticsAvgRequest.avgIf);
    dateDifference += 1;

    Object.keys(TYPE).forEach((key) => {
      analyticsAvgRequest.contains = key;
      const type = this.functionType(analyticsAvgRequest);
      const repository = this.functionRepo({ contains: TYPE[key] });

      if (type === TYPEIF.COUNTRYANALYTICS) {
        data.push(
          this.commonQuery(repository, type, analyticsAvgRequest)
            .andWhere(`${type}.countryName LIKE :countryName`, { countryName: `${analyticsAvgRequest.countryName}` })
            .getRawOne()
        );
      } else { 
        data.push(this.commonQuery(repository, type, analyticsAvgRequest).getRawOne());
      }
    });

    const values_1 = await Promise.all(data);
    const result = values_1.map((item) => {
      item = {
        [Object.keys(item)[0]]: Number(Object.values(item)[0]) / dateDifference,
      };
      return item;
    });
    return result;
  }

  //* 각 통계 기간별 합계
  public async findBySum(analyticsRequest: FindOneSumRequest) {
    const type = this.functionType(analyticsRequest);
    const repository = this.functionRepo(analyticsRequest);

    let repo: any;
    if (type === "CountryAnalytics") {
      repo = this.commonQuery(repository, type, analyticsRequest)
        .andWhere(`${type}.countryName LIKE :countryName`, { countryName: `${analyticsRequest.countryName}` })
        .getRawOne();
    } else {
      repo = this.commonQuery(repository, type, analyticsRequest).getRawOne();
    }

    return Object.values(await repo)[0];
  }

  //* 각 통계 기간별 평균
  public async findByAvg(analyticsRequest: FindOneAvgRequest) {
    const type = this.functionType(analyticsRequest);
    const repository = this.functionRepo(analyticsRequest);

    //* 날짜 일수 차이 구하기 (d = 일, M = 월, y = 년)
    let dateDifference: number = dayjs(analyticsRequest.lastDate).diff(dayjs(analyticsRequest.firstDate), analyticsRequest.avgIf);
    dateDifference += 1;

    let repo: any;
    if (type === "CountryAnalytics") {
      repo = this.commonQuery(repository, type, analyticsRequest)
        .andWhere(`${type}.countryName LIKE :countryName`, { countryName: `${analyticsRequest.countryName}` })
        .getRawOne();
    } else {
      repo = this.commonQuery(repository, type, analyticsRequest).getRawOne();
    }

    const avgCalculation = Number(Object.values(await repo)[0]) / dateDifference;

    //* 결과값이 정수형일 경우 정수형 출력, 아닐 경우 소수점 1자리까지 출력
    return Math.floor(avgCalculation * 10) / 10;
  }

  //* 유저의 기간 별 누적 접속 횟수
  public async findByUserUsed(analyticsRequest: FindUserRequest) {
    if (!(await this.findByUserId(analyticsRequest.userPk))) {
      throw new HttpException("존재하지 않는 회원PK 입니다.", 403);
    }

    return await this.userRepository
      .createQueryBuilder("UserAnalytics")
      .select(`SUM(UserAnalytics.userPk)`, `UserAnalytics`)
      .where(`UserAnalytics.createdDate >= :firstDate`, { firstDate: `${analyticsRequest.firstDate}` })
      .andWhere(`UserAnalytics.createdDate <= :lastDate`, { lastDate: `${analyticsRequest.lastDate}` })
      .andWhere(`UserAnalytics.userPk LIKE :userPk`, { userPk: `${analyticsRequest.userPk}` })
      .getCount();
  }

  //* 유저가 접속을 얼마나 하지 않았는지
  public async findByUserUnused(analyticsRequest: FindUserUnusedRequest) {
    if (!(await this.findByUserId(analyticsRequest.userPk))) {
      throw new HttpException("존재하지 않는 회원PK 입니다.", 403);
    }

    const repo = await this.loginLogRepository
      .createQueryBuilder("Login")
      .select("last_login_time")
      .where(`Login.userPk LIKE :userPk`, { userPk: `${analyticsRequest.userPk}` })
      .getRawOne();

    const userLoginDate = dayjs(`${Object.values(repo)[0]}`);
    const now = dayjs();

    return now.diff(userLoginDate, "d");
  }

  //* 전체 유저의 기간 별 누적 접속횟수
  public async findAllUserUsed(analyticsRequest: FindAllUserRequest) {
    const repo = await this.userRepository
      .createQueryBuilder("UserAnalytics")
      .select(`SUM(UserAnalytics.userPk)`, `UserAnalytics`)
      .where(`UserAnalytics.createdDate >= :firstDate`, { firstDate: `${analyticsRequest.firstDate}` })
      .andWhere(`UserAnalytics.createdDate <= :lastDate`, { lastDate: `${analyticsRequest.lastDate}` })
      .getCount();

    return repo;
  }

  // UserAnalytics DB에서 사용자 ID 찾기
  public async findByUserId(userPk: string) {
    return await this.userRepository.findOne({ where: { userPk } });
  }

  // 각각의 통계 Entity 구분을 위한 Method
  public functionType(analyticsRequest: any) {
    let value = TYPE[analyticsRequest.contains.toUpperCase()];

    if (value) {
      value = value[0].toUpperCase() + value.slice(1);
      return `${value}Analytics`;
    } else {
      throw new HttpException("정확한 값을 입력해주세요.", 403);
    }
  }

  // 각각의 통계 Repository 구분을 위한 Method
  public functionRepo(analyticsRequest: any) {
    // return this[analyticsRequest.contains];
    const repository =
      analyticsRequest.contains == TYPE.SIGNUP
        ? this.signupRepository
        : analyticsRequest.contains == TYPE.SECESSION
        ? this.secessionRepository
        : analyticsRequest.contains == TYPE.LOGIN
        ? this.loginRepository
        : analyticsRequest.contains == TYPE.COUNTRY
        ? this.countryRepository
        : null;

    return repository;
  }
}
