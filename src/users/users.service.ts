import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}
  async createUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
    // 1) nickname 중복이 없는지 확인
    // exist() => 만약에 조건에 해당되는 값이 있으면 true 반환
    const nicknameExists = await this.usersRepository.exists({
      where: { nickname: user.nickname },
    });
    const emailExists = await this.usersRepository.exists({
      where: { email: user.email },
    });
    if (nicknameExists) {
      throw new BadRequestException('닉네임이 중복되었습니다');
    }
    if (emailExists) {
      throw new BadRequestException('이메일이 중복되었습니다');
    }
    const userObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });
    const newUser = this.usersRepository.save(userObject);
    return newUser;
  }
  async getAllUsers() {
    return this.usersRepository.find();
  }
  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
