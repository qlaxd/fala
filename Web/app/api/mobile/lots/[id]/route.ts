import { prisma } from '../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { withAuth } from '../../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for updating a lot
const updateLotSchema = z.object({
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

// GET: Get a specific commercial lot
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAuth(request, async () => {
    try {
      const lot = await prisma.commercialLot.findUnique({
        where: { id },
        include: { images: true },
      });
      if (!lot) {
        throw new ApiError('NOT_FOUND', 'Commercial lot not found', 404);
      }
      return successResponse(lot);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// PUT: Update a specific commercial lot
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const lotData = updateLotSchema.parse(body);
      const lot = await prisma.commercialLot.update({
        where: { id },
        data: lotData,
      });
      return successResponse(lot);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']);
}

// DELETE: Delete a specific commercial lot
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAuth(request, async () => {
    try {
      await prisma.commercialLot.delete({
        where: { id },
      });
      return successResponse({ id });
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']);
}
