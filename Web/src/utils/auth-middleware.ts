import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { ApiError, handleApiError } from './api-utils';

// JWT Secret - in a production app, this would be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fala-farm-secret-key';

// Types for the decoded token
export interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Authentication middleware for protected API routes
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse>,
  requiredRoles?: string[]
) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError('UNAUTHORIZED', 'Missing or invalid authorization header', 401);
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError('UNAUTHORIZED', 'Missing token', 401);
    }
    
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new ApiError('UNAUTHORIZED', 'Invalid or expired token', 401);
    }
    
    // Check if the user has the required roles
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(decoded.role)) {
        throw new ApiError('FORBIDDEN', 'Insufficient permissions', 403);
      }
    }
    
    // Call the handler with the authenticated user
    return await handler(request, decoded);
  } catch (error) {
    return handleApiError(error);
  }
} 