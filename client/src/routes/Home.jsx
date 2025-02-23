import { useState, useEffect } from "react";
import clsx from "clsx";
import { z } from "zod";
import axiosInstance from "../axiosInstance";

function Home() {
  const [inputDate, setInputDate] = useState(null);
  const [appliedDate, setAppliedDate] = useState(null);
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const dateSchema = z.string().date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `/dashboard/returns${
          appliedDate ? `?date=${appliedDate}` : ""
        }`;
        const response = await axiosInstance.get(url);
        setIssuances(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedDate]);

  const handleApplyFilter = () => {
    const validation = dateSchema.safeParse(inputDate);
    if (!validation.success) {
      setValidationError(validation.error.issues[0].message);
      return;
    }
    setValidationError(null);
    setAppliedDate(inputDate);
  };

  const handleMarkAsReturned = async (id, memberName, bookTitle) => {
    try {
      await axiosInstance.post(`/dashboard/returns/${id}/return`);
      alert(`${memberName}'s ${bookTitle} has been marked as returned.`);
      // Remove the returned issuance from the list
      setIssuances((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert(`Failed to mark ${memberName}'s ${bookTitle} as returned.`);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="px-6 py-8">
          <div className="flex mb-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900">
                Pending Book Returns
              </h1>
              {appliedDate ? (
                <p className="text-sm text-gray-500 mt-1">
                  Showing returns for {appliedDate}
                </p>
              ) : (
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Showing all pending returns
                </p>
              )}
            </div>
            <div className="flex ml-6 h-fit gap-2">
              <input
                type="date"
                className="border rounded-full px-4 py-1.5 text-sm border-gray-300"
                value={inputDate || ""}
                onChange={(e) => {
                  setInputDate(e.target.value || null);
                  setValidationError(null);
                }}
              />

              {validationError && (
                <span className="text-xs text-red-500">{validationError}</span>
              )}
              {appliedDate ? (
                <button
                  onClick={() => {
                    setInputDate(null);
                    setAppliedDate(null);
                  }}
                  className="rounded-full px-4 py-1.5 font-medium text-sm border hover:bg-red-200 cursor-pointer bg-red-100 border-red-200 text-red-700"
                >
                  Clear
                </button>
              ) : inputDate ? (
                <button
                  onClick={handleApplyFilter}
                  className="rounded-full px-4 py-1.5 font-medium text-sm border hover:bg-blue-200 cursor-pointer bg-blue-100 border-blue-200 text-blue-700"
                >
                  Apply Filter
                </button>
              ) : null}
              <span className="text-xs text-gray-500">
                *Select date to filter returns for that day
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="w-full overflow-x-scroll">
              <div className="border min-w-5xl w-full rounded-md overflow-hidden border-gray-200">
                <div className="flex font-medium bg-gray-50 border-b border-gray-200 text-sm px-4 py-2">
                  <span className="flex-1">Member Name</span>
                  <span className="flex-1">Phone / Email</span>
                  <span className="flex-1">Book Title</span>
                  <span className="flex-1">Issuance Date</span>
                  <span className="flex-1">Target Return Date</span>
                  <span className="flex-1">Status</span>
                  <span className="flex-1">Action</span>
                </div>

                {issuances.map((item, index) => (
                  <div
                    className="flex items-center text-sm text-gray-800 px-4 py-2.5 border-b last:border-b-0 border-gray-200 even:bg-white"
                    key={index}
                  >
                    <span className="flex-1">{item.member_name}</span>
                    <div className="flex text-sm flex-col flex-1">
                      <a
                        className="hover:underline"
                        href={`tel:${item.mem_phone}`}
                      >
                        {item.mem_phone}
                      </a>
                      <a
                        className="text-blue-700 hover:underline"
                        href={`mailto:${item.member_email}`}
                      >
                        {item.member_email}
                      </a>
                    </div>
                    <span className="flex-1">{item.book_title}</span>
                    <span className="flex-1">
                      {new Date(item.issuance_date).toISOString().split("T")[0]}
                    </span>
                    <span className="flex-1">
                      {
                        new Date(item.target_return_date)
                          .toISOString()
                          .split("T")[0]
                      }
                    </span>
                    <div className="flex-1">
                      <span
                        className={clsx(
                          "flex-1",
                          item.issuance_status === "pending"
                            ? "rounded bg-yellow-100 px-2 py-0.5 border-yellow-300 text-xs border text-yellow-700 font-medium w-fit"
                            : ""
                        )}
                      >
                        Pending
                      </span>
                    </div>
                    <span className="flex-1">
                      <button
                        onClick={() =>
                          handleMarkAsReturned(
                            item.id,
                            item.member_name,
                            item.book_title
                          )
                        }
                        className="cursor-pointer text-gray-900 hover:bg-white border rounded bg-gray-50 border-gray-200 shadow-sm px-2 py-1 font-medium text-xs"
                      >
                        Mark as Returned
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
