import prisma from "../config/client"
import { Prisma } from "@prisma/client";



// check if a record (that's meant to be unique) already exist
export const alreadyExist = async<T>(tableName: Prisma.ModelName, column: keyof T, value: string): Promise<boolean> => {
    // @ts-ignore - using dynamic table access, ensuring the type matches the model methods
    const result = await prisma[tableName].findFirst({
        where: {
            [column]: value
        }
    }) 

    return result != null;
}







