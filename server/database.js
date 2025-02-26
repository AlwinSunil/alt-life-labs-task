import { Pool } from "pg";
import bcrypt from "bcrypt";

import errorHandler from "./middleware/errorHandler";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'member')) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT UNIQUE
      );

      CREATE TABLE IF NOT EXISTS memberships (
        id SERIAL PRIMARY KEY,
        member_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (member_id) REFERENCES members (id)
      );

      CREATE TABLE IF NOT EXISTS collections (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        sub_name TEXT
      );

      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        collection_id INTEGER,
        launch_date TEXT,
        publisher TEXT,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        FOREIGN KEY (collection_id) REFERENCES collections (id)
      );

      CREATE TABLE IF NOT EXISTS issuances (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL,
        issuance_date TEXT NOT NULL,
        member_id INTEGER NOT NULL,
        issued_by TEXT NOT NULL,
        target_return_date TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books (id),
        FOREIGN KEY (member_id) REFERENCES members (id)
      );
    `);

    // Check if data exists before inserting
    const row = await client.query("SELECT COUNT(*) as count FROM members");
    if (row.rows[0].count === "0") {
      await client.query(`
        INSERT INTO members (name, phone, email) VALUES
          ('Alice Johnson', '123-456-7890', 'alice@example.com'),
          ('Bob Smith', '987-654-3210', 'bob@example.com'),
          ('Charlie Brown', '555-666-7777', 'charlie@example.com'),
          ('David White', '111-222-3333', 'david@example.com'),
          ('Eve Black', '444-555-6666', 'eve@example.com');

        INSERT INTO memberships (member_id, status) VALUES
          (1, 'active'),
          (2, 'inactive'),
          (3, 'active'),
          (4, 'active'),
          (5, 'inactive');

        INSERT INTO collections (name) VALUES
          ('Fiction'),
          ('Science'),
          ('History'),
          ('Technology'),
          ('Philosophy');

        INSERT INTO categories (name, sub_name) VALUES
          ('Novel', 'Classic'),
          ('Science', 'Physics'),
          ('History', 'Modern'),
          ('Technology', 'Programming'),
          ('Philosophy', 'Ethics');

        INSERT INTO books (name, category_id, collection_id, launch_date, publisher) VALUES
          ('To Kill a Mockingbird', 1, 1, '1960-07-11', 'J.B. Lippincott & Co.'),
          ('A Brief History of Time', 2, 2, '1988-03-01', 'Bantam Books'),
          ('Sapiens: A Brief History of Humankind', 3, 3, '2011-09-04', 'Harper'),
          ('The Pragmatic Programmer', 4, 4, '1999-10-20', 'Addison-Wesley'),
          ('The Republic', 5, 5, '380 BC', 'Ancient Greece');

        INSERT INTO issuances (book_id, issuance_date, member_id, issued_by, target_return_date, status) VALUES
          (1, '2025-02-01', 1, 'Admin', '2025-02-28', 'issued'),
          (2, '2025-02-02', 2, 'Admin', '2025-03-02', 'returned'),
          (3, '2025-02-03', 3, 'Admin', '2025-03-03', 'issued'),
          (4, '2025-02-04', 4, 'Admin', '2025-03-04', 'issued'),
          (5, '2025-02-05', 5, 'Admin', '2025-03-05', 'returned');
      `);
      console.log("Database initialized successfully with sample data.");
    } else {
      console.log(
        "Database already contains data. Skipping sample data insertion."
      );
    }

    // Add demo user if not exists
    const demoUser = await client.query(
      "SELECT * FROM users WHERE email = $1",
      ["demo@example.com"]
    );
    if (demoUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("demo@example", 10);
      await client.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
        ["demo@example.com", hashedPassword, "admin"]
      );
      console.log("Demo user added to the database.");
    }
  } catch (error) {
    console.error("Error while initializing the database:", error);
    errorHandler(error);
  }

  return client;
}
