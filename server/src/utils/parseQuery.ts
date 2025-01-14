import { querySchema } from "../schemas/querySchema";

export function parseQueryParamsToPrismaQuery(query: Record<string, string | undefined>) {
  const parsedQuery = querySchema.parse(query);

  const prismaQuery = {
    skip: parsedQuery.page * parsedQuery.limit,
    take: parsedQuery.limit,
    orderBy: parsedQuery.sort,
    where: parsedQuery.filter,
  };

  return prismaQuery;
}


console.log(JSON.stringify(parseQueryParamsToPrismaQuery({
    "page": "2",
    "limit": "30",
    "sort": "name:asc,age:desc,title:asc",
    "filter": "name:ade,age:gt(14),title:inam,published:lte(2024-12-28)"
})))


  
