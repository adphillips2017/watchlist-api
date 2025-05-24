import * as fs from 'fs';
import * as path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import healthSchema from './schema/health.schema.js';



const DATABASE_URL = process.env.DATABASE_URL || './data/watchlist.db';
const dbPath = path.resolve(process.cwd(), DATABASE_URL);

let dbInstance: Awaited<ReturnType<typeof open>> | null = null; // This will hold the database connection

export async function initializeDatabase() {
    try {
        // Ensure the directory for the database file exists
        const dataDir = path.dirname(dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Open the database connection
        dbInstance = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        console.log(`Connected to SQLite database: ${dbPath}`);

        // Enable foreign keys
        await dbInstance.exec(`PRAGMA foreign_keys = ON;`);

        // --- Execute all schema definition SQL ---
        const schemasToExecute = [
            ...healthSchema
        ];

        for (const sqlStatement of schemasToExecute) {
            await dbInstance.exec(sqlStatement);
        }
        console.log('All schemas ensured and initialized.');
        // --- End schema execution ---

        console.log('Database initialized successfully.');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

export function getDb(): Awaited<ReturnType<typeof open>> {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return dbInstance;
}