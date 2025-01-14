/**
 * 
 * page: 0
 * limit: 10
 * sort: name:asc,age:desc,title:asc
 * filter: name:ade,age:gt(14),title:inam,published:lte(2024-12-28)
 */

import { z } from "zod"


export const querySchema = z.object({
    page: z.string().regex(/^\d+$/).transform((value) => parseInt(value, 10)).default("0"),
    limit: z.string().regex(/^\d+$/).transform((value) => parseInt(value, 10)).default("10"),
    sort: z
        .string()
        .regex(/^(\w+:(asc|desc))(,(\w+:(asc|desc)))*$/)
        .optional()
        .transform((value) => value
            ? value.split(",").map((item) => {
                const [field, order] = item.split(":");
                return { [field]: order.toLowerCase() === "desc" ? "desc" : "asc" };
            })
            : []
        ),
    filter: z
        .string()
        .regex(/^(\w+:(\w+|(gt|lt|gte|lte|equals|not)\([\w\s\-:.,]+\)))(,(\w+:(\w+|(gt|lt|gte|lte|equals|not)\([\w\s\-:.,]+\))))*$/)
        .optional()
        .transform((value) => value
            ? value.split(",").reduce((acc, filterItem) => {
                const [field, condition] = filterItem.split(":");
                const match = condition.match(/^(\w+)\((.+)\)$/); // for operators (numbers and date)
                if (match) {
                    const [, operator, val] = match;
                    acc[field] = { [operator]: isNaN(val as any) ? val : parseFloat(val) };
                } else {
                    acc[field] = condition;
                }
                return acc;
            }, {} as Record<string, any>)
            : {}
        ),
});
