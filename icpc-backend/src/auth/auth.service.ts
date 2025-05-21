import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login({ username, email, password }: LoginDto) {
    let user = await this.usersService.findOneByEmail(email);

    if (user === null) {
      // Verificar si el username es un email
      const isUsernameEmail = username && /\S+@\S+\.\S+/.test(username);

      if (isUsernameEmail) {
        // Buscar por email usando el valor de username
        user = await this.usersService.findOneByEmail(username);
      } else {
        // Buscar por username normalmente
        user = await this.usersService.findOneByUsername(username);
      }

      if (user === null) {
        throw new BadRequestException('Usuario o correo inválido');
      }
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      id: user.id, // 👈 Nuevo
      username: user.userName,
      email: user.email,
      role: user.role.role,
      name: user.name,
      lastName: user.lastName
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        userName: user.userName,
        email: user.email,
        role: user.role.role,
        name: user.name,
        lastName: user.lastName
      },
      token
    };
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }
  async profile({ id }: { id: string }) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      role: {
        rolId: user.role.id,
        role: user.role.role
      }
    };
  }
}