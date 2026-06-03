import sharp from 'sharp';
import fs from 'fs';

export class ImageService {
  static async processImage(inputPath: string, outputPath: string, width: number = 800) {
    try {
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outputPath);
      
      // Delete original
      fs.unlinkSync(inputPath);
      
      return true;
    } catch (error) {
      console.error('Image processing error:', error);
      return false;
    }
  }

  static getImageUrl(req: any, filename: string): string {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/products/${filename}`;
  }
}