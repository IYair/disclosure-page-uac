import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    enum: RoleEnum,
    default: RoleEnum.USER
  })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
