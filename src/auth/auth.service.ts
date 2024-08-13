import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, gmail: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      name,
      gmail,
      password: hashedPassword,
      isActive: true,
    });
    await this.usersRepository.save(user);
    return this.generateToken(user);
  }

  async login(name: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { name } });

    // Check for google to prevent people trying to user the google account credentials to login since we do not store password
    if (!user || user.isGoogle) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let user = await this.usersRepository.findOne({
      where: { gmail: req.user.email },
    });

    // TODO: check if the user has updated his display name and information, for now we can skip
    // If user from google is not there in the DB update it.
    if (!user) {
      user = this.usersRepository.create({
        name: req.user.displayName,
        gmail: req.user.email,
        isActive: true,
        // Adding a blank password here as we do not persist anything relating to password
        // To avoid the null constraint
        password: '',
        isGoogle: true,
      });
      await this.usersRepository.save(user);
    }

    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
