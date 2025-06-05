import { prisma } from '../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { withAuth } from '../../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for updating an auction
const updateAuctionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  auctionDate: z.string().datetime().optional(),
  location: z.string().optional(),
  status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

// GET handler for fetching a specific auction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id } = await params;
      const auction = await prisma.auction.findUnique({
        where: { id },
        include: {
          animals: {
            include: {
              animal: true,
            },
          },
          registrations: true,
        },
      });
      if (!auction) {
        throw new ApiError('NOT_FOUND', 'Auction not found', 404);
      }
      return successResponse(auction);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// PATCH handler for updating an auction
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const updateData = updateAuctionSchema.parse(body);
      const existingAuction = await prisma.auction.findUnique({ where: { id } });
      
      if (!existingAuction) {
        throw new ApiError('NOT_FOUND', 'Auction not found', 404);
      }
      const updatedAuction = await prisma.auction.update({
        where: { id },
        data: updateData,
      });
      return successResponse(updatedAuction);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']);
}

// DELETE handler for deleting an auction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id } = await params;
      const existingAuction = await prisma.auction.findUnique({ where: { id } });
      if (!existingAuction) {
        throw new ApiError('NOT_FOUND', 'Auction not found', 404);
      }
      await prisma.auction.delete({ where: { id } });
      return successResponse({ message: 'Auction deleted' });
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']);
}
