import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import {
  FILE_UPLOAD_MULTER_OPTIONS,
  FileStorageService,
} from './file-storage.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileStorageController {
  constructor(private readonly fileStorage: FileStorageService) {}

  @Post(':folder')
  @UseInterceptors(FileInterceptor('file', FILE_UPLOAD_MULTER_OPTIONS))
  async uploadFile(
    @Param('folder') folder: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const uploadFolder = this.fileStorage.parseFolder(folder);
    return this.fileStorage.saveFile(file, uploadFolder, req.user.id);
  }

  @Get(':folder/:filename')
  @Header('Cache-Control', 'private, no-store')
  async serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const stream = await this.fileStorage.createReadStream(folder, filename);
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeType =
      extension === 'pdf'
        ? 'application/pdf'
        : extension === 'png'
          ? 'image/png'
          : 'image/jpeg';

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${filename.replace(/"/g, '')}"`,
      'X-Content-Type-Options': 'nosniff',
    });

    stream.pipe(res);
  }
}
