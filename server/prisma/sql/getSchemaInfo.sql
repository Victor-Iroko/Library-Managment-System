SELECT
    c.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    tc.constraint_type,
    kcu.constraint_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.columns c
LEFT JOIN 
    information_schema.key_column_usage kcu
    ON c.table_name = kcu.table_name
    AND c.column_name = kcu.column_name
LEFT JOIN 
    information_schema.table_constraints tc
    ON kcu.constraint_name = tc.constraint_name
LEFT JOIN 
    information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
WHERE 
    c.table_schema = 'public'
ORDER BY 
    c.table_name, c.ordinal_position;
