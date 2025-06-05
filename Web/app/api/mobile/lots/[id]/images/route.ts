import { prisma } from '../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { withAuth } from '../../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for adding an image
const addImageSchema = z.object({
  imageUrl: z.string().url(),
  isPrimary: z.boolean().optional(),
});

// POST: Add an image to a commercial lot
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const imageData = addImageSchema.parse(body);
      // Check if the lot exists
      const existingLot = await prisma.commercialLot.findUnique({
        where: { id },
      });
      if (!existingLot) {
        throw new ApiError('NOT_FOUND', 'Commercial lot not found', 404);
      }
      // If the image is set as primary, update all other images to not be primary
      if (imageData.isPrimary) {
        await prisma.lotImage.updateMany({
          where: { lotId: id },
          data: { isPrimary: false },
        });
      }
      // Add the image
      const image = await prisma.lotImage.create({
        data: {
          lotId: id,
          imageUrl: imageData.imageUrl,
          isPrimary: imageData.isPrimary ?? false,
        },
      });
      return successResponse(image, 201);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']);
}

// GET: List images for a commercial lot
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAuth(request, async () => {
    try {
      const existingLot = await prisma.commercialLot.findUnique({
        where: { id },
      });
      if (!existingLot) {
        throw new ApiError('NOT_FOUND', 'Commercial lot not found', 404);
      }
      const images = await prisma.lotImage.findMany({
        where: { lotId: id },
        orderBy: { isPrimary: 'desc' },
      });
      return successResponse(images);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
