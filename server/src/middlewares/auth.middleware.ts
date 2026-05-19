import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthToken extends JwtPayload {
  user_id: string;
  role: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role: string;
        username: string;
    };
}

const JWT_SECRET = process.env.JWT_SECRET || 'tayson'

export const auth = async(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' })
            return
        }
        try {
            const decodedToken = jwt.verify(token, JWT_SECRET) as AuthToken
            req.user = {
                id: decodedToken.user_id,
                role: decodedToken.role,
                username: decodedToken.username,
            }
            next()
        } catch (error) {
            res.status(401).json({ success: false, message: error.message || 'Invalid or expired authentication token.' })
        }
    }

export const isPermitted = (...allowedRoles: string[]) => 
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user

        if (!user) {
            res.status(401).json({ message: 'Please sign in.', success: false })
            return
        }

        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({ success: false, message: 'Action not permitted.' })
            return
        }

        next()
    }
