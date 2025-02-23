import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/book")
      .then((response) => {
        console.log(response.data);
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-8">
        <div className="w-full overflow-x-scroll">
          <div className="border min-w-5xl w-full rounded-md overflow-hidden border-gray-200">
            {/* Updated Table Header */}
            <div className="flex font-medium bg-gray-50 border-b border-gray-200 text-sm px-4 py-2">
              <span className="w-16">ID</span>
              <span className="flex-1">Name</span>
              <span className="flex-1">Publisher</span>
              <span className="flex-1">Launch Date</span>
              <span className="flex-1">Category</span>
            </div>
            {/* Updated Table Rows */}
            {books.map((book) => (
              <div
                key={book.id}
                className="flex items-center text-sm text-gray-800 px-4 py-2.5 border-b last:border-b-0 border-gray-200 even:bg-white"
              >
                <span className="w-16">{book.id}</span>
                <span className="flex-1">{book.name}</span>
                <span className="flex-1">{book.publisher}</span>
                <span className="flex-1">{book.launch_date}</span>
                <span className="flex-1">{book.category_id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Books;
