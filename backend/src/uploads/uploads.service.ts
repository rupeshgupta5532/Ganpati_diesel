import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No file provided');
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Only image files are allowed');
    }

    try {
      const filename = `${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`;
      const filePath = path.join(this.uploadDir, filename);
      
      fs.writeFileSync(filePath, file.buffer);
      
      return {
        success: true,
        data: {
          url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${filename}`,
          secure_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${filename}`
        }
      };
    } catch (error) {
      throw new BadRequestException('Image upload failed');
    }
  }

  async deleteImage(publicId: string): Promise<any> {
    return { success: true };
  }
}
