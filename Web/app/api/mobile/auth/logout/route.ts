import { prisma } from '../../../../../src/lib/prisma';
import { handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validate the logout request
const logoutSchema = z.object({
  userId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const { userId } = logoutSchema.parse(body);
    
    // Clear the refresh token
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    
    return successResponse({ message: 'Logged out successfully' });
  } catch (error) {
    return handleApiError(error);
  }
} 