import { prisma } from '../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { withAuth } from '../../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for updating a breeding animal
const updateAnimalSchema = z.object({
  earTag: z.string().min(1).optional(),
  animalType: z.string().min(1).optional(),
  birthType: z.string().min(1).optional(),
  growthRate: z.number().optional(),
  yearlyWeight: z.number().optional(),
  lambIndex: z.number().optional(),
  weanerGrowth: z.number().optional(),
  isActive: z.boolean().optional(),
});

// GET handler for fetching a specific breeding animal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const { id } = params;
      
      // Find the animal
      const animal = await prisma.breedingAnimal.findUnique({
        where: { id },
        include: { 
          images: true,
          auctions: {
            include: {
              auction: true,
            },
          },
        },
      });
      
      if (!animal) {
        throw new ApiError('NOT_FOUND', 'Breeding animal not found', 404);
      }
      
      return successResponse(animal);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

// PUT handler for updating a breeding animal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = params;
      const body = await req.json();
      
      // Validate the request body
      const updateData = updateAnimalSchema.parse(body);
      
      // Check if the animal exists
      const existingAnimal = await prisma.breedingAnimal.findUnique({
        where: { id },
      });
      
      if (!existingAnimal) {
        throw new ApiError('NOT_FOUND', 'Breeding animal not found', 404);
      }
      
      // Update the animal
      const updatedAnimal = await prisma.breedingAnimal.update({
        where: { id },
        data: updateData,
      });
      
      return successResponse(updatedAnimal);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']); // Only admin and manager roles can update animals
}

// DELETE handler for marking an animal as inactive (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const { id } = params;
      
      // Check if the animal exists
      const existingAnimal = await prisma.breedingAnimal.findUnique({
        where: { id },
      });
      
      if (!existingAnimal) {
        throw new ApiError('NOT_FOUND', 'Breeding animal not found', 404);
      }
      
      // Soft delete the animal (mark as inactive)
      const updatedAnimal = await prisma.breedingAnimal.update({
        where: { id },
        data: { isActive: false },
      });
      
      return successResponse({ message: 'Animal marked as inactive', animal: updatedAnimal });
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']); // Only admin and manager roles can delete animals
} 