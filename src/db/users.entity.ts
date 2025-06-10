import { BaseEntity, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true })
  email: string;

  // select = false не достаёт пароль из юзера, если это прямо не указано
  @Column({ select: false })
  password: string;
}
