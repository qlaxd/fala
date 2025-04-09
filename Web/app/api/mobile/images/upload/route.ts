import { handleApiError, successResponse } from '../../../../../src/utils/api-utils';
import { withAuth } from '../../../../../src/utils/auth-middleware';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { JwtPayload } from '../../../../../src/utils/auth-middleware';

// Define the allowed image types
const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// Define the maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Define the upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  return withAuth(request, async (req: NextRequest, user: JwtPayload) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        return NextResponse.json(
          { success: false, error: { code: 'NO_FILE', message: 'No file uploaded' } },
          { status: 400 }
        );
      }
      
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_FILE_TYPE',
              message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
            },
          },
          { status: 400 }
        );
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FILE_TOO_LARGE',
              message: `File size exceeds maximum allowed size of 5MB`,
            },
          },
          { status: 400 }
        );
      }
      
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = `${crypto.randomBytes(16).toString('hex')}_${Date.now()}.${fileExtension}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Ensure the upload directory exists
      await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
      
      // Return the file URL
      const fileUrl = `/uploads/${fileName}`;
      
      return successResponse({ url: fileUrl });
    } catch (error) {
      return handleApiError(error);
    }
  });
} 