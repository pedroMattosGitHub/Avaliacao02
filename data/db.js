
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("treinos.db");

export function initDb() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS filmes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      genero TEXT NOT NULL,
      ano TEXT NOT NULL
    );
  `);

  
  try {
    const rows = db.getAllSync("SELECT name FROM sqlite_master WHERE type='table' AND name='tarefas'");
    if (rows && rows.length > 0) {
    
      db.execSync(`
        INSERT INTO filmes (titulo, genero, ano)
        SELECT nome, 0, 'Geral' FROM tarefas;
      `);
    
    }
  } catch (e) {
  
    console.warn("Migração tarefas -> filmes: ", e);
  }
}
