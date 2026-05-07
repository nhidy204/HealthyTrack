import { Request, Response } from 'express';
import User from '../models/user';
import { signToken } from '../utils/jwt';
import type { AuthRequest } from '../middleware/auth';

// POST /api/auth/register
export async function register(req: Request, res: Response) {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        console.log('Register payload:', { firstName, lastName, username, email });

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
        }

        const existingUser = await User.findOne({
            $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
        });
        if (existingUser) {
            const field = existingUser.username === username.toLowerCase() ? 'username' : 'email';
            return res.status(409).json({ message: `${field === 'username' ? 'Username' : 'Email'} đã được sử dụng.`, field });
        }

        const user = await User.create({ firstName, lastName, username, email, password });
        console.log('User created:', user._id);

        const token = signToken(String(user._id));
        console.log('Token signed for userId:', user._id, 'token:', token.substring(0, 20) + '...');
        return res.status(201).json({ user, token });
    } catch (err) {
        console.error('Register error details:', err);
        return res.status(500).json({ message: 'Lỗi đăng ký tài khoản.' });
    }
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập username và mật khẩu.' });
        }

        const user = await User.findOne({ username: username.toLowerCase() }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        const token = signToken(String(user._id));
        return res.json({ user, token });
    } catch {
        return res.status(500).json({ message: 'Lỗi đăng nhập.' });
    }
}

// GET /api/auth/check-username?username=xxx
export async function checkUsername(req: Request, res: Response) {
    const { username } = req.query as { username: string };
    if (!username) return res.status(400).json({ message: 'Thiếu username.' });
    const existing = await User.findOne({ username: username.toLowerCase() });
    return res.json({ available: !existing });
}

// POST /api/auth/forgot-password
export async function forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    return res.json({ message: `Nếu email tồn tại, link đặt lại đã được gửi đến ${email}.` });
}

// POST /api/auth/reset-password
export async function resetPassword(req: Request, res: Response) {
    // In production: verify reset token from DB
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    }
    return res.json({ message: 'Mật khẩu đã được cập nhật.' });
}

// POST /api/auth/change-password
export async function changePassword(req: AuthRequest, res: Response) {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.userId).select('+password');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });

        const valid = await user.comparePassword(currentPassword);
        if (!valid) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng.' });

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: 'Mật khẩu mới cần ít nhất 8 ký tự.' });
        }

        user.password = newPassword;
        await user.save();
        return res.json({ message: 'Đã đổi mật khẩu thành công.' }); 
    } catch {
        return res.status(500).json({ message: 'Lỗi đổi mật khẩu.' });
    }
}