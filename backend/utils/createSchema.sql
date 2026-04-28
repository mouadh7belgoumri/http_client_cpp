-- SQLite
CREATE TABLE IF NOT EXISTS requests (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "headers" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "stored" INTEGER NOT NULL DEFAULT 1
);