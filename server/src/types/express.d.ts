import { user } from '@prisma/client';
import {AppAbility} from '../utils/permissions'
import { WhereInputPerModel } from '@casl/prisma/dist/types/prismaClientBoundTypes';

declare global {
    namespace Express {
        export interface Request {
            ability: AppAbility; // Or use your specific AppAbility type
            prismaAbility: WhereInputPerModel; // Ensure this matches the type returned by accessibleBy
            _user: user
        }
    }
}
