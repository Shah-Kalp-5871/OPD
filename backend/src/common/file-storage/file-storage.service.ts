import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { createReadStream, existsSync, mkdirSync, promises as fs } from 'fs';
import { basename, extname, join, normalize, resolve, sep } from 'path';
import { memoryStorage, type Options } from 'multer';

export type UploadFolder = 'lab' | 'clinical' | 'consent' | 'temp';

type FolderConfig = {
  allowedMimeTypes: readonly string[];
  maxSizeBytes: number;
};

const TEN_MB = 10 * 1024 * 1024;

const MIME_EXTENSION_MAP: Record<string, readonly string[]> = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/pdf': ['.pdf'],
};

const FOLDER_CONFIG: Record<UploadFolder, FolderConfig> = {
  lab: {
    allowedMimeTypes: ['application/pdf'],
    maxSizeBytes: TEN_MB,
  },
  clinical: {
    allowedMimeTypes: ['image/png', 'image/jpeg'],
    maxSizeBytes: TEN_MB,
  },
  consent: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf'],
    maxSizeBytes: TEN_MB,
  },
  temp: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf'],
    maxSizeBytes: TEN_MB,
  },
};

const ALLOWED_FOLDERS = new Set<UploadFolder>([
  'lab',
  'clinical',
  'consent',
  'temp',
]);

const UPLOAD_MIME_ALLOWLIST = new Set(
  Object.values(FOLDER_CONFIG).flatMap((config) => [
    ...config.allowedMimeTypes,
  ]),
);

export const FILE_UPLOAD_MULTER_OPTIONS: Options = {
  storage: memoryStorage(),
  limits: {
    fileSize: TEN_MB,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!UPLOAD_MIME_ALLOWLIST.has(file.mimetype)) {
      callback(new BadRequestException('Unsupported file type'));
      return;
    }

    callback(null, true);
  },
};

export type StoredFileMetadata = {
  originalName: string;
  filename: string;
  folder: UploadFolder;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  path: string;
  url: string;
  sha256Hash: string;
};

@Injectable()
export class FileStorageService {
  private readonly uploadRoot = resolve(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadFolders();
  }

  private ensureUploadFolders() {
    mkdirSync(this.uploadRoot, { recursive: true });

    for (const folder of ALLOWED_FOLDERS) {
      mkdirSync(join(this.uploadRoot, folder), { recursive: true });
    }
  }

  parseFolder(folder: string): UploadFolder {
    if (!ALLOWED_FOLDERS.has(folder as UploadFolder)) {
      throw new BadRequestException('Unsupported upload folder');
    }

    return folder as UploadFolder;
  }

  private validateFile(
    file: Express.Multer.File | undefined,
    folder: UploadFolder,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const config = FOLDER_CONFIG[folder];
    if (!config.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Unsupported file type for this upload target',
      );
    }

    if (file.size > config.maxSizeBytes) {
      throw new BadRequestException(
        `File size exceeds ${Math.round(config.maxSizeBytes / 1024 / 1024)}MB`,
      );
    }

    const extension = extname(file.originalname || '').toLowerCase();
    const allowedExtensions = MIME_EXTENSION_MAP[file.mimetype] || [];
    if (!extension || !allowedExtensions.includes(extension)) {
      throw new BadRequestException(
        'File extension does not match the uploaded MIME type',
      );
    }

    return extension;
  }

  async saveFile(
    file: Express.Multer.File | undefined,
    folder: UploadFolder,
    uploadedBy: string,
  ): Promise<StoredFileMetadata> {
    const extension = this.validateFile(file, folder);
    const uploadFile = file as Express.Multer.File;
    const filename = `${randomUUID()}${extension}`;
    const folderPath = join(this.uploadRoot, folder);
    const absolutePath = join(folderPath, filename);
    const uploadedAt = new Date();
    const storedPath = `uploads/${folder}/${filename}`;

    await fs.writeFile(absolutePath, uploadFile.buffer, { flag: 'wx' });

    return {
      originalName: uploadFile.originalname,
      filename,
      folder,
      mimeType: uploadFile.mimetype,
      size: uploadFile.size,
      uploadedBy,
      uploadedAt,
      path: storedPath,
      url: `/files/${folder}/${filename}`,
      sha256Hash: createHash('sha256').update(uploadFile.buffer).digest('hex'),
    };
  }

  async createReadStream(folder: string, filename: string) {
    const uploadFolder = this.parseFolder(folder);
    const safeFilename = this.validateStoredFilename(filename);
    const filePath = this.resolveStoredPath(uploadFolder, safeFilename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return createReadStream(filePath);
  }

  private validateStoredFilename(filename: string) {
    const safeFilename = basename(filename);
    if (
      !safeFilename ||
      safeFilename !== filename ||
      safeFilename.includes('..') ||
      !/^[0-9a-f-]{36}\.(png|jpe?g|pdf)$/i.test(safeFilename)
    ) {
      throw new BadRequestException('Invalid file name');
    }

    return safeFilename;
  }

  private resolveStoredPath(folder: UploadFolder, filename: string) {
    const folderPath = resolve(this.uploadRoot, folder);
    const filePath = resolve(folderPath, normalize(filename));

    if (
      !filePath.startsWith(`${folderPath}${sep}`) &&
      filePath !== folderPath
    ) {
      throw new BadRequestException('Invalid file path');
    }

    return filePath;
  }
}
