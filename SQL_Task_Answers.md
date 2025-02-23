## SQL Answers

### 1. Write a query to get all books that have never been borrowed  

```sql
SELECT b.name AS "Book Name", b.publisher AS "Publisher"
FROM books b
LEFT JOIN issuances i ON b.id = i.book_id
WHERE i.book_id IS NULL;
```

*Here showing Publishers as no Author name was given in the table schema shared.*

---

### 2. Write a query that can list the outstanding books at any given point in time  

```sql
SELECT m.name AS "Member Name",
       b.name AS "Book Name",
       i.issuance_date AS "Issued Date",
       i.target_return_date AS "Target Return Date",
       b.publisher AS "Publisher"
FROM issuances i
JOIN members m ON i.member_id = m.id
JOIN books b ON i.book_id = b.id
WHERE i.status = 'issued';
```

*Here showing Publishers as no Author name was given in the table schema shared.*

---

### 3. Write a query to extract the top 10 most borrowed books  

```sql
SELECT b.name AS "Book Name",
       COUNT(i.id) AS "# of Times Borrowed",
       COUNT(DISTINCT i.member_id) AS "# of Members that Borrowed"
FROM issuances i
JOIN books b ON i.book_id = b.id
GROUP BY b.id
ORDER BY COUNT(i.id) DESC
LIMIT 10;
```