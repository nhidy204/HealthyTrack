import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    console.error(err.stack);
    res.status(500).json({ message: err.message ?? 'Lỗi máy chủ.' });
}

export function notFound(_req: Request, res: Response) {
    res.status(404).json({ message: 'Route không tồn tại.' });
}