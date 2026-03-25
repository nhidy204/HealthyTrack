import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'dev_secret';
const EXPIRES = process.env.JWT_EXPIRES_IN ?? '7d';

export interface JwtPayload {
    userId: string;
}

export function signToken(userId: string): string {
    return jwt.sign({ userId } as JwtPayload, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, SECRET) as JwtPayload;
}