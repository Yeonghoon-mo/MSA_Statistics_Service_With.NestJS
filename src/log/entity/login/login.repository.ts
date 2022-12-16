import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LogRequest } from "src/log/DTO/log.dto";
import { Repository } from "typeorm";
import { Login } from "./login.entity";

@Injectable()
export class LoginRepository {
  constructor(@InjectRepository(Login) private readonly loginRepository: Repository<Login>) {}

  //* Login Log 저장
  public async loginSave(loginRequest: LogRequest) {
    return await this.loginRepository.save(loginRequest);
  }

  //* Login Table 사용자 ID 찾기
  public async findByUserId(userPk: string) {
    return await this.loginRepository.findOne({ where: { userPk } });
  }

  //* Last Login Date Update
  public async loginDateUpdate(loginRequest: LogRequest) {
    return await this.loginRepository.update(loginRequest.userPk, loginRequest);
  }
}
