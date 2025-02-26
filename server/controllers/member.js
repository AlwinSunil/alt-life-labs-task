// Get all members
export const getMembers = async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const members = await db.query(
      "SELECT id, name, phone, email FROM members"
    );
    res.status(200).json(members.rows);
  } catch (error) {
    next(error);
  }
};

// Get a single member by ID
export const getMember = async (req, res, next) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const member = await db.query(
      "SELECT id, name, phone, email FROM members WHERE id = $1",
      [id]
    );
    if (member.rows.length > 0) {
      res.status(200).json(member.rows[0]);
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    next(error);
  }
};

// Create a new member
export const createMember = async (req, res, next) => {
  const db = req.app.locals.db;
  const { name, phone, email } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO members (name, phone, email) VALUES ($1, $2, $3) RETURNING id",
      [name, phone, email]
    );
    res.status(201).json({ id: result.rows[0].id, name, phone, email });
  } catch (error) {
    next(error);
  }
};

// Update an existing member
export const updateMember = async (req, res, next) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { name, phone, email } = req.body;
  try {
    const result = await db.query(
      "UPDATE members SET name = $1, phone = $2, email = $3 WHERE id = $4 RETURNING id",
      [name, phone, email, id]
    );
    if (result.rowCount > 0) {
      res.status(200).json({ id, name, phone, email });
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a member
export const deleteMember = async (req, res, next) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM members WHERE id = $1", [id]);
    if (result.rowCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    next(error);
  }
};
