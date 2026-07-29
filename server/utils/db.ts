import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import Database from 'better-sqlite3'

const DB_PATH = join(process.cwd(), '.data', 'shorty.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db)
    return _db

  const dir = dirname(DB_PATH)
  if (!existsSync(dir))
    mkdirSync(dir, { recursive: true })

  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  _db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      comment TEXT,
      title TEXT,
      description TEXT,
      image TEXT,
      expiration INTEGER,
      apple TEXT,
      google TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_links_slug ON links(slug);
    CREATE INDEX IF NOT EXISTS idx_links_created ON links(created_at);

    CREATE TABLE IF NOT EXISTS microsites (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      avatar TEXT,
      avatar_icon TEXT,
      theme TEXT NOT NULL DEFAULT 'auto',
      social_links TEXT DEFAULT '[]',
      items TEXT DEFAULT '[]',
      bg_color TEXT,
      bg_image TEXT,
      bg_overlay_opacity REAL DEFAULT 0.5,
      text_color TEXT,
      published INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_microsites_slug ON microsites(slug);

    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      link_id TEXT NOT NULL,
      slug TEXT NOT NULL,
      url TEXT,
      ip TEXT,
      referer TEXT,
      country TEXT,
      region TEXT,
      city TEXT,
      timezone TEXT,
      language TEXT,
      os TEXT,
      browser TEXT,
      browser_type TEXT,
      device TEXT,
      device_type TEXT,
      user_agent TEXT,
      latitude REAL DEFAULT 0,
      longitude REAL DEFAULT 0,
      is_bot INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
    CREATE INDEX IF NOT EXISTS idx_clicks_slug ON clicks(slug);
    CREATE INDEX IF NOT EXISTS idx_clicks_created ON clicks(created_at);
    CREATE INDEX IF NOT EXISTS idx_clicks_country ON clicks(country);

    CREATE TABLE IF NOT EXISTS microsite_events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'view',
      target_id TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      user_agent TEXT,
      ip TEXT,
      country TEXT,
      city TEXT,
      referrer TEXT,
      device TEXT,
      browser TEXT,
      os TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_microsite_events_target ON microsite_events(target_id);
    CREATE INDEX IF NOT EXISTS idx_microsite_events_timestamp ON microsite_events(timestamp);

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'editor', 'viewer')),
      active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS user_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
  `)

  migrateMicrositesTable(_db)

  return _db
}

export function closeDb(): void {
  if (_db) {
    _db.close()
    _db = null
  }
}

function migrateMicrositesTable(db: Database.Database): void {
  const columns = db.prepare('PRAGMA table_info(\'microsites\')').all() as { name: string }[]

  const hasColumn = (name: string) => columns.some(c => c.name === name)

  if (hasColumn('links') && !hasColumn('items')) {
    db.exec('ALTER TABLE microsites RENAME COLUMN links TO items')
  }

  if (!hasColumn('avatar_icon')) {
    db.exec('ALTER TABLE microsites ADD COLUMN avatar_icon TEXT')
  }

  if (!hasColumn('bg_color')) {
    db.exec('ALTER TABLE microsites ADD COLUMN bg_color TEXT')
  }
}
