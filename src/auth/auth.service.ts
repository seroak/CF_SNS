import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '../users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
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
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }
}
