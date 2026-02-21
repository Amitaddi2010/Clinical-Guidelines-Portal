import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    let token = null;
                    if (request && request.cookies) {
                        token = request.cookies['jwt'];
                    }
                    if (!token && request.headers.authorization) {
                        token = request.headers.authorization.split(' ')[1];
                    }
                    return token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'DEV_SECRET_KEY_CHANGE_IN_PROD_RS256',
        });
    }

    async validate(payload: any) {
        const user = await this.userRepository.findOne({ where: { id: payload.sub } });
        if (!user || (!user.is_active && user.role !== 'super_admin')) {
            throw new UnauthorizedException('User account is disabled or does not exist');
        }
        return user;
    }
}
