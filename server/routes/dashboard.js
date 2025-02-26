import express from "express";
const router = express.Router();

router.get("/returns", async (req, res) => {
  try {
    const { date } = req.query;
    const db = req.app.locals.db;

    let query;
    let params = [];

    if (date) {
      query = `
      SELECT 
        i.id,
        m.name AS member_name, 
        m.phone AS mem_phone, 
        m.email AS member_email, 
        b.name AS book_title, 
        i.issuance_date, 
        i.target_return_date, 
        i.status AS issuance_status
      FROM issuances i 
      JOIN members m ON i.member_id = m.id 
      JOIN books b ON i.book_id = b.id
      WHERE i.status = 'issued' AND i.target_return_date = $1
      ORDER BY i.target_return_date`;
      params = [date];
    } else {
      query = `
      SELECT 
        i.id,
        m.name AS member_name, 
        m.phone AS mem_phone, 
        m.email AS member_email, 
        b.name AS book_title, 
        i.issuance_date, 
        i.target_return_date, 
        i.status AS issuance_status
      FROM issuances i 
      JOIN members m ON i.member_id = m.id 
      JOIN books b ON i.book_id = b.id
      WHERE i.status = 'issued'
      ORDER BY i.target_return_date`;
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching pending returns", error);
    res.status(500).json({ error: error.message });
  }
});

// New Controller to mark an issuance as returned
router.post("/returns/:id/return", async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    const result = await db.query(
      `UPDATE issuances SET status = 'returned' WHERE id = $1 AND status = 'issued' RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Issuance record not found or already returned.",
      });
    }
    res.json({ message: "Issuance marked as returned." });
  } catch (error) {
    console.error("Error marking issuance as returned", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
