import { prisma } from '../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import * as jwt from 'jsonwebtoken';

// JWT Secret - in a production app, this would be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fala-farm-secret-key';
const JWT_EXPIRES_IN = '15m'; // 15 minutes

// Validate the refresh token request
const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const { refreshToken } = refreshTokenSchema.parse(body);
    
    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
    } catch (error) {
      throw new ApiError('INVALID_TOKEN', 'Invalid refresh token', 401);
    }
    
    // Find the user with the matching refresh token
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        refreshToken,
      },
      select: {
        id: true,
        role: true,
        username: true,
        email: true,
      },
    });
    
    if (!user) {
      throw new ApiError('INVALID_TOKEN', 'Refresh token not found or expired', 401);
    }
    
    // Generate a new access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Return the new access token
    return successResponse({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
} 