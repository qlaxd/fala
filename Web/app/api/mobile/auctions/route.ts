import { prisma } from '../../../../src/lib/prisma';
import { handleApiError, successResponse } from '../../../../src/utils/api-utils';
import { withAuth } from '../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for creating an auction
const createAuctionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  auctionDate: z.string().datetime(), // ISO string
  location: z.string().optional(),
});

// GET handler for listing auctions with filtering and pagination
export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const status = searchParams.get('status') || undefined;
      const sortBy = searchParams.get('sortBy') || 'auctionDate';
      const sortOrder = searchParams.get('sortOrder') || 'desc';
      const search = searchParams.get('search') || undefined;
      const skip = (page - 1) * limit;
      const where: any = {
        ...(status && { status }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };
      const [auctions, totalCount] = await Promise.all([
        prisma.auction.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.auction.count({ where }),
      ]);
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      return successResponse({
        auctions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      });
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// POST handler for creating a new auction
export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const auctionData = createAuctionSchema.parse(body);
      // Prisma expects Date, not string
      const createdAuction = await prisma.auction.create({
        data: {
          ...auctionData,
          auctionDate: new Date(auctionData.auctionDate),
        },
      });
      return successResponse(createdAuction, 201);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']);
}
