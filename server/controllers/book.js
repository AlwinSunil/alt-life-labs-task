export async function getBooks(req, res, next) {
  try {
    const db = req.app.locals.db;
    // Explicitly selecting columns including id
    const books = await db.all(
      "SELECT id, name, publisher, launch_date, category_id FROM books"
    );
    res.json(books);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getBook(req, res, next) {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    // Fetch specific columns
    const book = await db.get(
      "SELECT id, name, publisher, launch_date, category_id FROM books WHERE id = ?",
      id
    );
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function createBook(req, res, next) {
  try {
    // Expecting the frontend to post these fields
    const { name, publisher, launch_date, category_id } = req.body;
    if (!name || !publisher) {
      return res.status(400).json({ error: "Name and publisher are required" });
    }
    const db = req.app.locals.db;
    // Inserts including the new columns
    const result = await db.run(
      "INSERT INTO books (name, publisher, launch_date, category_id) VALUES (?, ?, ?, ?)",
      name,
      publisher,
      launch_date || null,
      category_id || null
    );
    const newBook = {
      id: result.lastID,
      name,
      publisher,
      launch_date: launch_date || null,
      category_id: category_id || null,
    };
    res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const { name, publisher, launch_date, category_id } = req.body;
    const db = req.app.locals.db;
    const book = await db.get(
      "SELECT id, name, publisher, launch_date, category_id FROM books WHERE id = ?",
      id
    );
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const updatedName = name || book.name;
    const updatedPublisher = publisher || book.publisher;
    const updatedLaunchDate =
      launch_date !== undefined ? launch_date : book.launch_date;
    const updatedCategoryId =
      category_id !== undefined ? category_id : book.category_id;
    await db.run(
      "UPDATE books SET name = ?, publisher = ?, launch_date = ?, category_id = ? WHERE id = ?",
      updatedName,
      updatedPublisher,
      updatedLaunchDate,
      updatedCategoryId,
      id
    );
    res.json({
      id,
      name: updatedName,
      publisher: updatedPublisher,
      launch_date: updatedLaunchDate,
      category_id: updatedCategoryId,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const book = await db.get("SELECT id FROM books WHERE id = ?", id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    await db.run("DELETE FROM books WHERE id = ?", id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
