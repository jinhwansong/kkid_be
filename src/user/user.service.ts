import { User } from "@/entities";
import { CreateUserDto } from "@/video/dto/user.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOrCreateUser(info: CreateUserDto): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email: info.email } });
    if (!user) {
      user = this.userRepository.create({
        email: info.email,
        username: info.username,
        nickname: info.nickname,
        userId: info.id,
        profileImagePath: info.profileImagePath,
      });
    }else {
      // 있으면 업데이트
      user.username = info.username;
      user.nickname = info.nickname;
      user.userId = info.id;
      user.profileImagePath = info.profileImagePath;
    }
    return await this.userRepository.save(user);
  }
}