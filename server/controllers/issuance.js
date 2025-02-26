// Get all issuances
export const getIssuances = async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const issuances = await db.query("SELECT * FROM issuances");
    res.status(200).json(issuances.rows);
  } catch (error) {
    next(error);
  }
};

// Get a single issuance by ID
export const getIssuance = async (req, res, next) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const issuance = await db.query("SELECT * FROM issuances WHERE id = $1", [
      id,
    ]);
    if (issuance.rows.length > 0) {
      res.status(200).json(issuance.rows[0]);
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
    const result = await db.query(
      "INSERT INTO issuances (book_id, member_id, issuance_date, target_return_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [book_id, member_id, issued_date || null, return_date || null, "issued"]
    );
    res.status(201).json({
      id: result.rows[0].id,
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
    const issuance = await db.query("SELECT * FROM issuances WHERE id = $1", [
      id,
    ]);
    if (issuance.rows.length === 0) {
      return res.status(404).json({ error: "Issuance not found." });
    }
    const updatedBookId =
      book_id !== undefined ? book_id : issuance.rows[0].book_id;
    const updatedMemberId =
      member_id !== undefined ? member_id : issuance.rows[0].member_id;
    const updatedIssuedDate =
      issued_date !== undefined ? issued_date : issuance.rows[0].issuance_date;
    const updatedReturnDate =
      return_date !== undefined
        ? return_date
        : issuance.rows[0].target_return_date;

    await db.query(
      "UPDATE issuances SET book_id = $1, member_id = $2, issuance_date = $3, target_return_date = $4 WHERE id = $5",
      [updatedBookId, updatedMemberId, updatedIssuedDate, updatedReturnDate, id]
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
    const issuance = await db.query("SELECT * FROM issuances WHERE id = $1", [
      id,
    ]);
    if (issuance.rows.length === 0) {
      return res.status(404).json({ error: "Issuance not found." });
    }
    const result = await db.query("DELETE FROM issuances WHERE id = $1", [id]);
    if (result.rowCount > 0) {
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
    const issuance = await db.query("SELECT * FROM issuances WHERE id = $1", [
      id,
    ]);
    if (issuance.rows.length === 0) {
      return res.status(404).json({ error: "Issuance not found." });
    }
    // Toggle the status assuming statuses "issued" and "returned"
    const newStatus =
      issuance.rows[0].status === "issued" ? "returned" : "issued";

    await db.query("UPDATE issuances SET status = $1 WHERE id = $2", [
      newStatus,
      id,
    ]);

    res.status(200).json({ ...issuance.rows[0], status: newStatus });
  } catch (error) {
    next(error);
  }
};
