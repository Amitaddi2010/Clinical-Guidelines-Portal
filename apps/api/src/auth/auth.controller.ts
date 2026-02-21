import { Controller, Post, Get, Req, Res, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('saml/login')
    //@UseGuards(AuthGuard('saml'))
    async samlLogin() {
        // Initiates SAML login flow redirect to NIC SSO
        return { message: 'Redirecting to NIC SSO...' };
    }

    @Post('saml/callback')
    //@UseGuards(AuthGuard('saml'))
    async samlCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        // Stub mock profile for dev purposes
        const mockProfile = { email: 'author@icmr.gov.in', displayName: 'Dr. Example', nameID: 'UID-1234' };

        const user = await this.authService.validateSamlUser(mockProfile);
        const tokens = this.authService.generateTokens(user);

        // Set HTTP-Only refresh token (7 days)
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Set Access token in cookie for SPA
        res.cookie('jwt', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 min memory
        });

        return { message: 'Successfully authenticated via SAML', user: { id: user.id, email: user.email, role: user.role } };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }
}
