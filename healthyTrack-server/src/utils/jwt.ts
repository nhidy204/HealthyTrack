import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in .env');
  return secret;
}

function getExpires(): string {
  const expires = process.env.JWT_EXPIRES_IN;
  if (!expires) throw new Error('JWT_EXPIRES_IN is not defined in .env');
  return expires;
}

export function signToken(userId: string): string {
  return jwt.sign({ userId } as JwtPayload, getSecret(), { expiresIn: getExpires() } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}