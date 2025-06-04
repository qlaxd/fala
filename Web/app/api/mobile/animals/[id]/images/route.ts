import { prisma } from '../../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../../src/utils/api-utils';
import { withAuth } from '../../../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for adding an image
const addImageSchema = z.object({
  imageUrl: z.string().url(),
  isPrimary: z.boolean().optional(),
});

// Validation schema for updating an image
const updateImageSchema = z.object({
  isPrimary: z.boolean(),
});

// POST handler for adding an image to an animal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const imageData = addImageSchema.parse(body);
      
      // Check if the animal exists
      const existingAnimal = await prisma.breedingAnimal.findUnique({
        where: { id },
      });

      if (!existingAnimal) {
        throw new ApiError('NOT_FOUND', 'Breeding animal not found', 404);
      }
      
      // If the image is set as primary, update all other images to not be primary
      if (imageData.isPrimary) {
        await prisma.animalImage.updateMany({
          where: { animalId: id },
          data: { isPrimary: false },
        });
      }
      
      // Add the image
      const image = await prisma.animalImage.create({
        data: {
          animalId: id,
          imageUrl: imageData.imageUrl,
          isPrimary: imageData.isPrimary ?? false,
        },
      });

      return successResponse(image, 201);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']); // Only admin and manager roles can add images
}

// GET handler for listing animal images
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAuth(request, async () => {
    try {
      const existingAnimal = await prisma.breedingAnimal.findUnique({
        where: { id },
      });
      
      if (!existingAnimal) {
        throw new ApiError('NOT_FOUND', 'Breeding animal not found', 404);
      }
      
      // Get the images
      const images = await prisma.animalImage.findMany({
        where: { animalId: id },
        orderBy: { isPrimary: 'desc' },
      });

      return successResponse(images);
    } catch (error) {
      return handleApiError(error);
    }
  });
}