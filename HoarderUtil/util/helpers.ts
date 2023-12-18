import * as fs from 'fs/promises';
import * as path from 'path';

import PromptSync = require('prompt-sync');
import output from './output';
import * as prompt from 'prompt-sync';
import { TerminalArgs } from './types';
import { exifToJsDate } from './dateUtils';

const ExifImage = require('exif').ExifImage;

const defaultAc = (_input: string) => ['y', 'n'];

export const getUserInput = <T extends string = string>(
  message = 'Enter your input',
  opts?: {
    /** Options for auto complete in the terminal */
    autocomplete?: PromptSync.Option['autocomplete'];
    validate?: ((input: string) => boolean) | T[];
    default?: T;
  }
): T => {
  const prompter = prompt();
  output.out(`${message}:`);

  const rawResult = prompter({ autocomplete: opts?.autocomplete ?? defaultAc });

  if (!rawResult && opts?.default) return opts.default;

  if (!rawResult) return getUserInput(message, opts);

  const result = rawResult.toLowerCase() as T;

  if (opts.validate) {
    if (Array.isArray(opts.validate)) {
      if (
        !opts.validate.some((o: string) =>
          o.toLowerCase().includes(result.toLowerCase())
        )
      )
        return getUserInput(message, opts);
    } else {
      const valid = opts.validate(result);

      if (!valid) return getUserInput(message, opts);
    }
  }

  return result as T;
};

/**
 * Get 'y' or 'n' from the user
 */
export const getUserConfirmation = (
  message: string,
  /** Just say yes */
  autoCommit = false
): 'y' | 'n' =>
  autoCommit
    ? 'y'
    : getUserInput<'y' | 'n'>(message + ' (y/n)', {
        autocomplete: () => ['y', 'n'],
        default: 'n',
      });

const exitApp = (code = 0) => {
  output.dump();
  process.exit(code);
};

export const errorAndQuit = (message: string) => {
  output.error(message);

  exitApp(1);
};

export const messageAndQuit = (message: string) => {
  output.out(message);

  exitApp();
};

export const getExif = (image: string): Promise<Date | null> =>
  new Promise((resolve) => {
    new ExifImage({ image }, (err, exif) => {
      if (err) resolve(null);

      const originalDate = exif?.exif?.DateTimeOriginal;
      const converted = originalDate ? exifToJsDate(originalDate) : null;

      resolve(originalDate ? new Date(converted) : null);
    });
  });

export const chunkArray = <T>(arr: T[], chunkSize: number) => {
  const result: Array<T>[] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

export const validDirectoryPath = async (dir: string) => {
  try {
    const stats = await fs.stat(dir);

    return stats.isDirectory();
  } catch (e) {
    return false;
  }
};

export const getFileList = (dir: string) => fs.readdir(dir);

export const getFileListWithExcludes = async (
  dir: string,
  excludes?: TerminalArgs['excludes']
) => {
  let excludeList: string[] | null;

  try {
    excludeList = excludes ? excludes.split(',').map((s) => s.trim()) : null;
  } catch (e: any) {
    errorAndQuit(`Invalid excludes provided. ${e.message}`);
  }

  const fullList = await getFileList(dir);

  if (!excludeList) return fullList;

  const filteredList = fullList.filter(
    (fileName) =>
      !excludeList.some((ex) =>
        fileName.toLowerCase().includes(ex.toLowerCase())
      )
  );

  output.log(
    `Excludes filter removed ${(fullList.length = filteredList.length)} files.`
  );

  return filteredList;
};

export const getExt = (fileName: string) =>
  path.extname(fileName).replace(/\./g, '');

export const getDateCreated = async (filePath: string) => {
  const stat = await fs.stat(filePath);

  return stat.ctime;
};

export const randomFromArray = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Do a message and something else
 */
export const msgShortcuts = {
  errorAndQuit,
  messageAndQuit,
};