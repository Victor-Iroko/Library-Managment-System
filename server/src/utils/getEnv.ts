import { InternalServerError } from '../errors/customError';
import { resolve } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, '../../.env') });




  export const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] ||  defaultValue;
    if (typeof value === 'undefined') {
        throw new InternalServerError(`${key} missing from environmental variables`);
    }
    return value;
};

