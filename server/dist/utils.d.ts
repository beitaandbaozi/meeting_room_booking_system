import { ParseIntPipe } from '@nestjs/common';
import * as multer from 'multer';
export declare function md5(data: string): string;
export declare function generateParseIntPipe(name: any): ParseIntPipe;
export declare const storage: multer.StorageEngine;
