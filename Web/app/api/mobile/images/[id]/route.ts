import { prisma } from '../../../../../src/lib/prisma';
import { ApiError, handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { withAuth } from '../../../../../src/utils/auth-middleware';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

// Validation schema for updating an image
const updateImageSchema = z.object({
  isPrimary: z.boolean(),
});

// PUT handler for updating an image (setting as primary)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = params;
      const body = await req.json();
      
      // Validate the request body
      const updateData = updateImageSchema.parse(body);
      
      // Find the image
      const image = await prisma.animalImage.findUnique({
        where: { id },
        include: { animal: true },
      });
      
      if (!image) {
        throw new ApiError('NOT_FOUND', 'Image not found', 404);
      }
      
      // If setting as primary, update all other images for this animal to not be primary
      if (updateData.isPrimary) {
        await prisma.animalImage.updateMany({
          where: {
            animalId: image.animalId,
            id: { not: id },
          },
          data: { isPrimary: false },
        });
      }
      
      // Update the image
      const updatedImage = await prisma.animalImage.update({
        where: { id },
        data: updateData,
      });
      
      return successResponse(updatedImage);
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']); // Only admin and manager roles can update images
}

// DELETE handler for removing an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const { id } = params;
      
      // Find the image
      const image = await prisma.animalImage.findUnique({
        where: { id },
      });
      
      if (!image) {
        throw new ApiError('NOT_FOUND', 'Image not found', 404);
      }
      
      // Delete the image file if it's stored locally
      if (image.imageUrl.startsWith('/uploads/')) {
        const fileName = image.imageUrl.split('/').pop();
        if (fileName) {
          const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
          
          // Check if the file exists
          try {
            await fsPromises.access(filePath);
            // Delete the file
            await fsPromises.unlink(filePath);
          } catch (error) {
            // File doesn't exist or couldn't be deleted, just log and continue
            console.warn(`Could not delete file at ${filePath}:`, error);
          }
        }
      }
      
      // Delete the image from the database
      await prisma.animalImage.delete({
        where: { id },
      });
      
      return successResponse({ message: 'Image deleted successfully' });
    } catch (error) {
      return handleApiError(error);
    }
  }, ['ADMIN', 'MANAGER']); // Only admin and manager roles can delete images
} 