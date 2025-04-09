import { prisma } from '../../../../src/lib/prisma';
import { handleApiError, successResponse } from '../../../../src/utils/api-utils';
import { withAuth } from '../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation schema for creating a breeding animal
const createAnimalSchema = z.object({
  earTag: z.string().min(1),
  animalType: z.string().min(1),
  birthType: z.string().min(1),
  growthRate: z.number().optional(),
  yearlyWeight: z.number().optional(),
  lambIndex: z.number().optional(),
  weanerGrowth: z.number().optional(),
});

// GET handler for listing breeding animals with filtering and pagination
export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      
      // Extract query parameters
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const sortBy = searchParams.get('sortBy') || 'earTag';
      const sortOrder = searchParams.get('sortOrder') || 'asc';
      const isActive = searchParams.get('isActive') !== 'false'; // Default to active animals
      const animalType = searchParams.get('animalType') || undefined;
      const search = searchParams.get('search') || undefined;
      
      // Calculate pagination values
      const skip = (page - 1) * limit;
      
      // Build the where clause
      const where = {
        isActive,
        ...(animalType && { animalType }),
        ...(search && {
          OR: [
            { earTag: { contains: search, mode: 'insensitive' as const } },
            { animalType: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };
      
      // Fetch animals with pagination
      const [animals, totalCount] = await Promise.all([
        prisma.breedingAnimal.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        }),
        prisma.breedingAnimal.count({ where }),
      ]);
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      
      return successResponse({
        animals,
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

// POST handler for creating a new breeding animal
export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      
      // Validate the request body
      const animalData = createAnimalSchema.parse(body);
      
      // Create the animal
      const animal = await prisma.breedingAnimal.create({
        data: animalData,
      });
      
      return successResponse(animal, 201);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']); // Only admin and manager roles can create animals
} 