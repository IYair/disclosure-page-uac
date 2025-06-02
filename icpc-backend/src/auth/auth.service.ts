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

  /*
  Input: { username, email, password }: LoginDto
  Output: Promise<{ user: { userName: string; email: string; role: string; name: string; lastName: string }; token: string }>
  Return value: User info and JWT token
  Function: Authenticates a user by username/email and password, returns user info and JWT
  Variables: user, isUsernameEmail, isPasswordMatch, payload, token
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async login({ username, email, password }: LoginDto) {
    let user = await this.usersService.findOneByEmail(email);

    // If user is not found by email, try to find by username
    if (user === null) {
      // Verify if the username is an email
      // This regex checks if the username looks like an email by searching for an '@' followed by a '.'
      const isUsernameEmail = username && /\S+@\S+\.\S+/.test(username);

      if (isUsernameEmail) {
        // Search by email using the username value
        user = await this.usersService.findOneByEmail(username);
      } else {
        // Search by username normally
        user = await this.usersService.findOneByUsername(username);
      }

      // If user is still not found, throw an error
      if (user === null) {
        throw new BadRequestException('Usuario o correo inválido');
      }
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    // If password does not match, throw an error
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      id: user.id,
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

  /*
  Input: registerDto: RegisterDto
  Output: Promise<any>
  Return value: Created user object or error
  Function: Registers a new user by delegating to UsersService.create
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async register(registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }

  /*
  Input: { id }: { id: string }
  Output: Promise<any>
  Return value: User profile info or error
  Function: Retrieves user profile by id, throws if not found
  Variables: user
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async profile({ id }: { id: string }) {
    const user = await this.usersService.findOneById(id);
    // If user is not found, throw an error
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
