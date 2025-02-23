// Get all members
export const getMembers = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const members = await db.all("SELECT id, name, phone, email FROM members");
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve members." });
  }
};

// Get a single member by ID
export const getMember = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const member = await db.get(
      "SELECT id, name, phone, email FROM members WHERE id = ?",
      id
    );
    if (member) {
      res.status(200).json(member);
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve member." });
  }
};

// Create a new member
export const createMember = async (req, res) => {
  const db = req.app.locals.db;
  const { name, phone, email } = req.body;
  try {
    const result = await db.run(
      "INSERT INTO members (name, phone, email) VALUES (?, ?, ?)",
      name,
      phone,
      email
    );
    res.status(201).json({ id: result.lastID, name, phone, email });
  } catch (error) {
    res.status(500).json({ error: "Failed to create member." });
  }
};

// Update an existing member
export const updateMember = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { name, phone, email } = req.body;
  try {
    const result = await db.run(
      "UPDATE members SET name = ?, phone = ?, email = ? WHERE id = ?",
      name,
      phone,
      email,
      id
    );
    if (result.changes > 0) {
      res.status(200).json({ id, name, phone, email });
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update member." });
  }
};

// Delete a member
export const deleteMember = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  try {
    const result = await db.run("DELETE FROM members WHERE id = ?", id);
    if (result.changes > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete member." });
  }
};
