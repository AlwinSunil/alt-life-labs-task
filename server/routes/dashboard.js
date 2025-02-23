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
        i.id as id,
        m.name as member_name, 
        m.phone as mem_phone, 
        m.email as member_email, 
        b.name as book_title, 
        i.issuance_date, 
        i.target_return_date, 
        i.status as issuance_status
      FROM issuances i 
      JOIN members m ON i.member_id = m.id 
      JOIN books b ON i.book_id = b.id
      WHERE i.status = 'issued' AND i.target_return_date = ?
      ORDER BY i.target_return_date
      `;
      params = [date];
    } else {
      query = `
      SELECT 
        i.id as id,
        m.name as member_name, 
        m.phone as mem_phone, 
        m.email as member_email, 
        b.name as book_title, 
        i.issuance_date, 
        i.target_return_date, 
        i.status as issuance_status
      FROM issuances i 
      JOIN members m ON i.member_id = m.id 
      JOIN books b ON i.book_id = b.id
      WHERE i.status = 'issued'
      ORDER BY i.target_return_date
      `;
    }

    const rows = await db.all(query, params);
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

    const result = await db.run(
      `UPDATE issuances SET status = 'returned' WHERE id = ? AND status = 'issued'`,
      [id]
    );

    if (result.changes === 0) {
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
