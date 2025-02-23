import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/member")
      .then((response) => {
        setMembers(response.data);
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
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
            {/* Table Header */}
            <div className="flex font-medium bg-gray-50 border-b border-gray-200 text-sm px-4 py-2">
              <span className="w-16">ID</span>
              <span className="flex-1">Member Name</span>
              <span className="flex-1">Phone / Email</span>
            </div>

            {/* Table Rows */}
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center text-sm text-gray-800 px-4 py-2.5 border-b last:border-b-0 border-gray-200 even:bg-white"
              >
                <span className="w-16">{member.id}</span>
                <span className="flex-1">{member.name}</span>
                <div className="flex flex-col flex-1 text-sm">
                  <a className="hover:underline" href={`tel:${member.phone}`}>
                    {member.phone}
                  </a>
                  <a
                    className="text-blue-700 hover:underline"
                    href={`mailto:${member.email}`}
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Members;
