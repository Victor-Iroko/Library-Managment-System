import { Prisma } from "@prisma/client";
import { ZodObject, z, ZodRawShape } from "zod";
import { BadRequestError } from "../errors/customError";
import { Request } from "express";

// Define types
type QueryParamsSchema = Record<string, string | object>;
type MainSchema = Prisma.ModelName;
type RelationSchemas = Partial<Record<Prisma.ModelName, ZodObject<ZodRawShape>>>;

// Helper: Validate and process a single key-value pair
const processKeyValue = async <T extends ZodRawShape>(
  key: string,
  value: unknown,
  schema: ZodObject<T>
): Promise<Record<string, unknown>> => {
  const targetField: Record<string, unknown> = {};
  const fieldSchema = schema.shape[key];

  if (!fieldSchema) throw new BadRequestError(`Field '${key}' does not exist in schema.`);

  // Boolean
  const boolResult = z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .safeParse(value);
  if (boolResult.success) {
    targetField[key] = boolResult.data;
    return targetField;
  }

  // Enums
  if (fieldSchema instanceof z.ZodEnum) {
    const enumResult = fieldSchema.safeParse(value);
    if (enumResult.success) {
      targetField[key] = enumResult.data;
      return targetField;
    }
  }

  // Numeric and Date Comparisons
  if (typeof value === "object" && value !== null) {
    const validKeys = ["gt", "lt", "lte", "gte", "equals", "not"];
    const comparisonObj: Record<string, unknown> = {};
    for (const [compKey, compValue] of Object.entries(value)) {
      if (!validKeys.includes(compKey)) {
        throw new BadRequestError(`Invalid comparison operator '${compKey}' for field '${key}'.`);
      }

      // Handle numeric and date comparisons
      if (z.coerce.number().safeParse(compValue).success) {
        comparisonObj[compKey] = Number(compValue);
      } else if (z.coerce.date().safeParse(compValue).success) {
        comparisonObj[compKey] = new Date(compValue as string);
      } else {
        throw new BadRequestError(`Invalid value '${compValue}' for field '${key}' operator '${compKey}'.`);
      }
    }

    targetField[key] = {...comparisonObj}
    return targetField;
  }

  // String
  if (fieldSchema.safeParse(value).success) {
    targetField[key] = { contains: value as string, mode: "insensitive" };
    return targetField;
  }

  throw new BadRequestError(`Unsupported value type for key '${key}'.`);
};

// Main Function: Build Filter Query
export const buildFilterQuery = async (
  filterQuery: QueryParamsSchema,
  mainSchema: MainSchema,
  relationSchemas: RelationSchemas
): Promise<Record<string, unknown>> => {
  const whereQuery: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filterQuery)) {
    let processed = false;

    for (const [relationName, relationSchema] of Object.entries(relationSchemas)) {
      if (!relationSchema) continue;

      const relationKeys = relationSchema.keyof().safeParse(key);
      if (relationKeys.success) {
        const target = relationName === mainSchema ? whereQuery : (whereQuery[relationName] ??= {});
        Object.assign(target, await processKeyValue(key, value, relationSchema));
        processed = true;
        break;
      }
    }

    if (!processed) {
      throw new BadRequestError(`Field '${key}' does not belong to any schema.`);
    }
  }

  return whereQuery;
};


export const buildPaginationQuery = async (
  paginationQuery: QueryParamsSchema
): Promise<Record<string, number>> => {

    const paginateQuery: Record<string, number> = {}
    const pageSchema = z.string().regex(/^\d+$/).transform((value) => parseInt(value, 10))
    const limitSchema = z.string().regex(/^\d+$/).transform((value) => parseInt(value, 10))

    const pageValue = paginationQuery["page"] || "0";
    const limitValue = paginationQuery["limit"] || "10";

    const parsedPage = pageSchema.safeParse(pageValue);
    const parsedLimit = limitSchema.safeParse(limitValue);

    if (parsedPage.success){
      paginateQuery['skip'] = parsedPage.data * (parsedLimit.success ? parsedLimit.data: 10);
    }

    if (parsedLimit.success){
      paginateQuery['take'] = parsedLimit.data
    }

    return paginateQuery
}


export const buildOrderByQuery = async (
  sortQuery: string,
  mainSchema: MainSchema,
  relationSchema: RelationSchemas
): Promise<Record<string, unknown>[]> => {
  
    const orderByQuery: Record<string, unknown>[] = []
    const sortSchema = z.string().regex(/^(\w+:(asc|desc))(,(\w+:(asc|desc)))*$/).optional()

    const sortValidation = sortSchema.safeParse(sortQuery)

    if (!sortValidation.data) {
      return orderByQuery
    }

    if (!sortValidation.success){
      throw new BadRequestError("Sort query is invalid")
    }

    const sortPairs = sortValidation.data.split(',')

    const getRelationEntry = (relationName: string): Record<string, any> => {
      let relationEntry = orderByQuery.find(entry => relationName in entry);
      if (!relationEntry) {
        relationEntry = { [relationName]: {} };
        orderByQuery.push(relationEntry);
      }
      return relationEntry;
    };

    for (const pair of sortPairs){
      const [field, direction] = pair.split(':')
      const relationEntry = Object.entries(relationSchema).find(([_relationName, schema]) => {
        return schema?.keyof().safeParse(field).success
      })

      if (!relationEntry){
        throw new BadRequestError(`Field '${field}' is not valid in the provided schemas.`)
      }

      const [relationName] = relationEntry

      if (relationName === mainSchema){
        orderByQuery.push({[field]: direction as 'asc' | 'desc'})
      } else {
        // fix this 
        const relation = getRelationEntry(relationName)
        relation[relationName][field] = direction as 'asc' | 'desc'
      }
    }
    return orderByQuery
}


export const buildQuery = async (
  req: Request,
  mainSchema: MainSchema,
  relationSchema: RelationSchemas
): Promise<{
  filterQuery: Record<string, unknown>;
  paginationQuery: Record<string, number>;
  orderByQuery: Record<string, unknown>[];
}> => {
  const { page, limit, sort, ...filter } = req.query;

  const [filterQuery, paginationQuery, orderByQuery] = await Promise.all([
    buildFilterQuery(filter as QueryParamsSchema, mainSchema, relationSchema),
    buildPaginationQuery({ page: page as string, limit: limit as string }),
    buildOrderByQuery(sort as string, mainSchema, relationSchema)
  ])

  return {
    filterQuery,
    paginationQuery,
    orderByQuery,
  };
};