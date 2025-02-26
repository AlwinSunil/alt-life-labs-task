export async function getBooks(req, res, next) {
  try {
    const db = req.app.locals.db;
    // Fetch all books
    const books = await db.query(
      "SELECT id, name, publisher, launch_date, category_id FROM books"
    );
    res.json(books.rows); // Use .rows to get the data
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getBook(req, res, next) {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    // Fetch specific book
    const book = await db.query(
      "SELECT id, name, publisher, launch_date, category_id FROM books WHERE id = $1",
      [id]
    );
    if (book.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book.rows[0]); // Return the first book
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function createBook(req, res, next) {
  try {
    const { name, publisher, launch_date, category_id } = req.body;
    if (!name || !publisher) {
      return res.status(400).json({ error: "Name and publisher are required" });
    }
    const db = req.app.locals.db;
    // Insert new book
    const result = await db.query(
      "INSERT INTO books (name, publisher, launch_date, category_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, publisher, launch_date || null, category_id || null]
    );
    const newBook = {
      id: result.rows[0].id,
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
    const book = await db.query(
      "SELECT id, name, publisher, launch_date, category_id FROM books WHERE id = $1",
      [id]
    );
    if (book.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    const updatedName = name || book.rows[0].name;
    const updatedPublisher = publisher || book.rows[0].publisher;
    const updatedLaunchDate =
      launch_date !== undefined ? launch_date : book.rows[0].launch_date;
    const updatedCategoryId =
      category_id !== undefined ? category_id : book.rows[0].category_id;
    await db.query(
      "UPDATE books SET name = $1, publisher = $2, launch_date = $3, category_id = $4 WHERE id = $5",
      [updatedName, updatedPublisher, updatedLaunchDate, updatedCategoryId, id]
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
    const book = await db.query("SELECT id FROM books WHERE id = $1", [id]);
    if (book.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
