import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/db/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly salt = 12;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(JwtService)
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signOn(email: string, password: string) {
    const existUser = await this.userRepository.findOneBy({ email });

    if (existUser) {
      throw new HttpException(
        'Пользователь с таким email уже зарегестрирован!',
        HttpStatus.CONFLICT,
      );
    }
    const hashPassword = await bcrypt.hash(password, this.salt);

    const newUser = this.userRepository.create();
    newUser.email = email;
    newUser.password = hashPassword;
    await this.userRepository.save(newUser);
    return this.signIn(email, password);
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const isTruePassword = await bcrypt.compare(password, user.password);

    if (!isTruePassword) {
      throw new HttpException(
        'Неверная почта или пароль',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      }),
    };
  }
}
