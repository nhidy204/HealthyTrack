import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/user';

export interface AuthRequest extends Request {
    userId?: string;
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có quyền truy cập.' });
    }

    const token = header.split(' ')[1];
    try {
        const payload = verifyToken(token);
        console.log('Token verified, userId:', payload.userId, 'endpoint:', req.method, req.path);
        
        // Check user still exists
        const user = await User.findById(payload.userId).select('_id');
        if (!user) return res.status(401).json({ message: 'Tài khoản không tồn tại.' });
        
        req.userId = payload.userId;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
}