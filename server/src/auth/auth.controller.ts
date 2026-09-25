import { Request, Response } from 'express';
import { AuthService, authService } from './auth.service';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  constructor(private service: AuthService = authService) {}

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name, phone, role } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required.' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
      }

      const result = await this.service.register({ email, password, name, phone, role });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Registration failed.' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const clientInfo = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || (req.socket.remoteAddress as string),
      };

      const result = await this.service.login({ email, password }, clientInfo);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message || 'Authentication failed.' });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required.' });
      }
      const result = await this.service.refreshToken(refreshToken);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message || 'Token refresh failed.' });
    }
  };

  logout = async (req: AuthRequest, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1] || '';
      const result = await this.service.logout(token);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Logout failed.' });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }
      const result = await this.service.forgotPassword(email);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Forgot password request failed.' });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and newPassword are required.' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
      }
      const result = await this.service.resetPassword(token, newPassword);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Reset password failed.' });
    }
  };

  getMe = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
      const user = await this.service.getCurrentUser(req.user.userId);
      return res.json({ user });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'User not found.' });
    }
  };
}

export const authController = new AuthController();
