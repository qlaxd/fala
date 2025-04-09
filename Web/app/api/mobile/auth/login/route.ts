import { prisma } from '../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// JWT Secret - in a production app, this would be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fala-farm-secret-key';
const JWT_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days

// Validate the login request
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const { username, password } = loginSchema.parse(body);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        passwordHash: true,
        role: true,
        username: true,
        email: true,
      },
    });
    
    if (!user) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid username or password', 401);
    }
    
    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid username or password', 401);
    }
    
    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
    
    // Update the user's refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLogin: new Date(),
      },
    });
    
    // Return the tokens and user info
    return successResponse({
      accessToken,
      refreshToken,
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