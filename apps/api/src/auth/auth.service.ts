import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async validateSamlUser(profile: any): Promise<User> {
        // Stub for NIC SSO SAML. In a real scenario, profile extracts data from SAML snippet.
        const email = profile.email || 'demouser@nic.in';
        let user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            // Auto-provision user on first SSO login
            user = this.userRepository.create({
                email,
                password_hash: 'SSO_MANAGED',
                full_name: profile.displayName || 'NIC SSO User',
                role: UserRole.AUTHOR,
                nic_sso_id: profile.nameID || 'MOCK_SSO_ID_123',
                department: 'General',
            });
            await this.userRepository.save(user);
        }

        // Update last login
        user.last_login = new Date();
        await this.userRepository.save(user);

        return user;
    }

    generateTokens(user: User) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // 15 min expiry per req
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // 7 days expiry per req

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
}
