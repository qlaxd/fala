import { prisma } from '../../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../../src/utils/api-utils';
import { withAuth } from '../../../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for registration
const registrationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
});

// GET: List all registrations for an auction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id } = await params;
      const registrations = await prisma.auctionRegistration.findMany({
        where: { auctionId: id },
        orderBy: { createdAt: 'desc' },
      });
      return successResponse(registrations);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']);
}

// POST: Register a new user for an auction
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const data = registrationSchema.parse(body);
      // Check if auction exists
      const auction = await prisma.auction.findUnique({ where: { id } });
      if (!auction) {
        throw new ApiError('NOT_FOUND', 'Auction not found', 404);
      }
      // Prevent duplicate registration by email for this auction
      const existing = await prisma.auctionRegistration.findFirst({
        where: { auctionId: id, email: data.email },
      });
      if (existing) {
        throw new ApiError('CONFLICT', 'You have already registered for this auction.', 409);
      }
      const registration = await prisma.auctionRegistration.create({
        data: {
          auctionId: id,
          ...data,
        },
      });
      return successResponse(registration, 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
