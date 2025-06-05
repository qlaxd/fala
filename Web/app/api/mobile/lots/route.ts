import { prisma } from '../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../src/utils/api-utils';
import { withAuth } from '../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for creating a lot
const createLotSchema = z.object({
  lotNumber: z.string().min(1),
  lambingDate: z.string().datetime(), // ISO string
  weightMin: z.number().optional(),
  weightMax: z.number().optional(),
  price: z.number().optional(),
  quantity: z.number().int().min(1).optional(),
  healthCertificates: z.array(z.string()),
  availabilityDate: z.string().datetime().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

// GET: List all commercial lots
export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const lots = await prisma.commercialLot.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: true },
      });
      return successResponse(lots);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// POST: Create a new commercial lot
export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const lotData = createLotSchema.parse(body);
      const lot = await prisma.commercialLot.create({
        data: lotData,
      });

      return successResponse(lot, 201);

    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']);
}
