import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '../users/entities/users.entity';
import { HASH_ROUNDS } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import {
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from 'src/common/const/env-keys.const';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   *
   * 토큰을 사용하게 되는 방식
   * 1) 사용자가 로그인 또는 회원가입을 진행하면
   * accessToken, refreshToken 반환
   * 2) 로그인 할때는 Basic 토큰과 함께 요청을 보낸다
   * Basic 토큰은 '이메일: 비밀번호"를 Base64로 인코딩한 값이다
   * @param isRefreshToken
   * @returns
   */
  /**
   * 우리가 만드려는 기능
   * 1) registerWithEmail
   * -email, nickname, password를 입력 받고 사용자 생성
   * - 생성 완료되면 accessToken refreshToken 반환
   *
   * 2) loginWithEmail
   * -email, password를 입력 받고 사용자 조회
   * - 조회 완료되면 accessToken refreshToken 반환
   *
   * 3) loginUser
   *  - 1) 2) 에서 필요한 accessToken refreshToken 반환
   *
   * 4) signToken
   * - 3)에서 필요한 accessToken refreshToken 생성
   *
   * 5) authenticateWithEmailAndPassword
   * - email, password를 입력 받고 사용자 조회
   * - 사용자 존재하는지 확인 비밀번호 맞는지 확인 모두 통과 되면 사용자 정보 반환
   *
   */
  /**
   * Payload에 들어갈 정보
   * 1) email
   * 2) sub -> id
   * 3) type -> access or refresh
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다!');
    }
    const token = splitToken[1];
    return token;
  }
  /**
   *
   * @param token
   * @returns
   * 토큰 검증
   */
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료되거나 잘못된 토큰입니다.');
    }
  }
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
    });
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 Refreash 토큰으로만 가능합니다!',
      );
    }
    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const split = decoded.split(':');
    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }
    const email = split[0];
    const password = split[1];
    return {
      email: email,
      password: password,
    };
  }
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }
  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const exitsingUser = await this.usersService.getUserByEmail(
      user.email as string,
    );
    if (!exitsingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다');
    }
    const passOk = await bcrypt.compare(user.password, exitsingUser.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }
    return exitsingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const exitsingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(exitsingUser);
  }
  async registerWithEmail(user: RegisterUserDto) {
    const hash = await bcrypt.hash(
      user.password,
      Number(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)!),
    );
    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });
    return this.loginUser(newUser);
  }
}
