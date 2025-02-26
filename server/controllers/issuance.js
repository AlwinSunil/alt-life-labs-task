// Get all issuances
export const getIssuances = async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const issuances = await db.all("SELECT * FROM issuances");
    res.status(200).json(issuances);
  } catch (error) {
    next(error);
  }
};

// Get a single issuance by ID
export const getIssuance = async (req, res, next) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const issuance = await db.get("SELECT * FROM issuances WHERE id = ?", id);
    if (issuance) {
      res.status(200).json(issuance);
    } else {
      res.status(404).json({ error: "Issuance not found." });
    }
  } catch (error) {
    next(error);
  }
};

// Create a new issuance
export const createIssuance = async (req, res, next) => {
  const db = req.app.locals.db;
  const { book_id, member_id, issued_date, return_date } = req.body;

  // Basic validation: require book_id and member_id
  if (!book_id || !member_id) {
    return res
      .status(400)
      .json({ error: "book_id and member_id are required." });
  }

  try {
    const result = await db.run(
      "INSERT INTO issuances (book_id, member_id, issued_date, return_date) VALUES (?, ?, ?, ?)",
      book_id,
      member_id,
      issued_date || null,
      return_date || null
    );
    res.status(201).json({
      id: result.lastID,
      book_id,
      member_id,
      issued_date: issued_date || null,
      return_date: return_date || null,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing issuance
export const updateIssuance = async (req, res, next) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { book_id, member_id, issued_date, return_date } = req.body;
  try {
    const issuance = await db.get("SELECT * FROM issuances WHERE id = ?", id);
    if (!issuance) {
      return res.status(404).json({ error: "Issuance not found." });
    }
    const updatedBookId = book_id !== undefined ? book_id : issuance.book_id;
    const updatedMemberId =
      member_id !== undefined ? member_id : issuance.member_id;
    const updatedIssuedDate =
      issued_date !== undefined ? issued_date : issuance.issued_date;
    const updatedReturnDate =
      return_date !== undefined ? return_date : issuance.return_date;

    await db.run(
      "UPDATE issuances SET book_id = ?, member_id = ?, issued_date = ?, return_date = ? WHERE id = ?",
      updatedBookId,
      updatedMemberId,
      updatedIssuedDate,
      updatedReturnDate,
      id
    );
    res.status(200).json({
      id,
      book_id: updatedBookId,
      member_id: updatedMemberId,
      issued_date: updatedIssuedDate,
      return_date: updatedReturnDate,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an issuance
export const deleteIssuance = async (req, res, next) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const issuance = await db.get("SELECT * FROM issuances WHERE id = ?", id);
    if (!issuance) {
      return res.status(404).json({ error: "Issuance not found." });
    }
    const result = await db.run("DELETE FROM issuances WHERE id = ?", id);
    if (result.changes > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Issuance not found." });
    }
  } catch (error) {
    next(error);
  }
};

// Toggle issuance status: issued <=> returned
export const toggleIssuance = async (req, res, next) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const issuance = await db.get("SELECT * FROM issuances WHERE id = ?", id);
    if (!issuance) {
      return res.status(404).json({ error: "Issuance not found." });
    }
    // Toggle the status assuming statuses "issued" and "returned"
    const newStatus = issuance.status === "issued" ? "returned" : "issued";

    await db.run("UPDATE issuances SET status = ? WHERE id = ?", newStatus, id);

    res.status(200).json({ ...issuance, status: newStatus });
  } catch (error) {
    next(error);
  }
};
