type Where<T> = {
    [P in keyof T]?: T[P] extends object
      ? Where<T[P]> | RelationFilter
      : FilterConditions<T[P]>;
  };
  
type FilterConditions<T> =
    | T
    | { equals?: T }
    | { not?: T | FilterConditions<T> }
    | { in?: T[] }
    | { notIn?: T[] }
    | { lt?: T }
    | { lte?: T }
    | { gt?: T }
    | { gte?: T }
    | { contains?: string }
    | { startsWith?: string }
    | { endsWith?: string };


type RelationFilter = {
    every?: Where<any>;
    some?: Where<any>;
    none?: Where<any>;
};



type OrderBy<T> = {
    [P in keyof T]?: T[P] extends object ? OrderBy<T[P]> : 'asc' | 'desc';
};
  

type Include<T> = {
    [P in keyof T]?: T[P] extends object ? true | Include<T[P]> : never;
};
  
type Select<T> = {
    [P in keyof T]?: T[P] extends object ? true | Select<T[P]> : true;
};
  
 
type QueryOptions<T> = {
    where?: Where<T>;
    orderBy?: OrderBy<T> | OrderBy<T>[];
    include?: Include<T>;
    select?: Select<T>;
    take?: number;
    skip?: number;
};
  
  
  
  

  
  
  


  