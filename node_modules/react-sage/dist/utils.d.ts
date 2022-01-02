import { UseFilePicker } from './useFilePicker';
/**
 * Wraps native File Reader API in a promise.
 */
export declare const loadFile: (file: File) => Promise<string>;
/**
 * Wraps native image loader API in a promise.
 */
export declare const loadImage: (dataUrl: string) => Promise<HTMLImageElement>;
export declare const areImageDimsValid: (image: HTMLImageElement, dims?: UseFilePicker.ImageDims | undefined) => boolean;
export declare const resizeImage: (img: HTMLImageElement, maxSize: number, mime: string, quality?: number) => Promise<Blob>;
export declare const sleep: (milliseconds: number) => Promise<void>;
