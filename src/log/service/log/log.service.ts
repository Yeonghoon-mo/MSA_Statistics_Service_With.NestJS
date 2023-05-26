import { HttpException, Injectable } from "@nestjs/common";
import axios from "axios";
import * as geoip from "geoip-country";
import { TYPE } from "../../../enum/enum";
import { LogRequest, LogRequestLoginTime } from "../../../log/DTO/log.dto";
import { LogRepository } from "../../../log/entity/log/log.repository";
import { LoginRepository } from "../../../log/entity/login/login.repository";

@Injectable()
export class LogService {
  constructor(private logRepository: LogRepository, private loginRepository: LoginRepository) {}

  //* 로그 저장
  async logSave(logRequest: LogRequestLoginTime) {
    const value = TYPE[logRequest.logType];

    if (value === "login") {
      if (logRequest.userPk === undefined) {
        throw new HttpException("PK값이 필요합니다.", 403);
      }
      this.lastLoginTime(logRequest);
      logRequest.logType = value;
      logRequest.countryName = await this.loginValidation(logRequest);
    } else if (value) {
      logRequest.logType = value;
    } else {
      throw new HttpException("정확한 값을 입력해주세요.", 403);
    }

    return await this.logRepository.save(logRequest);
  }

  //* 로그인 시 수행 될 Method
  public async loginValidation(logRequest: LogRequest): Promise<string> {
    if (await this.logRepository.findByUserId(logRequest.userPk)) {
      throw new HttpException("최종 로그인 시간 업데이트 성공", 202);
    }
    // Local IpAddress Get
    let ipAddress: string;
    await axios.get("https://extreme-ip-lookup.com/json").then((res) => {
      ipAddress = res.data.query;
    });

    return Object.values(geoip.lookup(ipAddress))[1];
  }

  //* 로그인 DB Insert & Update Method
  async lastLoginTime(loginRequest: LogRequestLoginTime) {
    if (await this.loginRepository.findByUserId(loginRequest.userPk)) {
      await this.loginRepository.loginDateUpdate(loginRequest);
    } else {
      await this.loginRepository.loginSave(loginRequest);
    }
  }
}
