import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import clsx from "clsx";

function Issuance() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/issuance")
      .then((response) => {
        console.log(response.data);
        setIssues(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (id) => {
    try {
      const response = await axiosInstance.patch(`/issuance/${id}/toggle`);
      alert("Issuance status updated.");
      // Replace the issuance in state with the updated one
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue.id === id ? response.data : issue))
      );
    } catch (error) {
      console.error(error);
      setError("Failed to toggle issuance status.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-8">
        <div className="w-full overflow-x-scroll">
          <div className="border min-w-5xl w-full rounded-md overflow-hidden border-gray-200">
            {/* Table Header */}
            <div className="flex font-medium bg-gray-50 border-b border-gray-200 text-sm px-4 py-2">
              <span className="flex-1">ID</span>
              <span className="flex-1">Book ID</span>
              <span className="flex-1">Member ID</span>
              <span className="flex-1">Issuance Date</span>
              <span className="flex-1">Issued By</span>
              <span className="flex-1">Target Return Date</span>
              <span className="flex-1">Status</span>
              <span className="flex-1">Actions</span>
            </div>
            {/* Table Rows */}
            {issues.map((issue, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-800 px-4 py-2.5 border-b last:border-b-0 border-gray-200 even:bg-white"
              >
                <span className="flex-1">{issue.id}</span>
                <span className="flex-1">{issue.book_id}</span>
                <span className="flex-1">{issue.member_id}</span>
                <span className="flex-1">{issue.issuance_date}</span>
                <span className="flex-1">{issue.issued_by}</span>
                <span className="flex-1">{issue.target_return_date}</span>
                <span className="flex-1 capitalize">{issue.status}</span>
                <span className="flex-1">
                  <button
                    onClick={() => handleToggle(issue.id)}
                    className={clsx(
                      "cursor-pointer border rounded shadow-sm px-2 py-1 font-medium text-xs",
                      issue.status === "issued"
                        ? "text-green-900 bg-green-50 border-green-200 shadow-green-100 hover:bg-green-100"
                        : "text-orange-900 bg-orange-50 border-orange-200 shadow-orange-100 hover:bg-orange-100"
                    )}
                  >
                    {issue.status === "issued"
                      ? "Mark as Returned"
                      : "Mark as Issued"}
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Issuance;
