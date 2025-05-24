const healthTableSql = `
CREATE TABLE IF NOT EXISTS health (
    id INTEGER PRIMARY KEY,
    healthy INTEGER NOT NULL
);
`;

const initialHealthDataSql = `
INSERT OR IGNORE INTO health (id, healthy) VALUES (1, 1);
`;

// Export an array of SQL statements
export default [
  healthTableSql,
  initialHealthDataSql
];
