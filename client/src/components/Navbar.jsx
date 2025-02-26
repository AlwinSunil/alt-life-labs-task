import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

import { Link } from "react-router";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="px-6 py-2 flex items-center border-gray-200 border-b">
      <h1 className="font-bold text-2xl mt-0.5">Alt Life Library</h1>

      {user && (
        <div className="flex ml-10 items-center text-sm font-medium gap-6">
          <Link className="hover:underline" to="/">
            Home (Pending Returns)
          </Link>
          <Link className="hover:underline" to="/members">
            Members
          </Link>
          <Link className="hover:underline" to="/books">
            Books
          </Link>
          <Link className="hover:underline" to="/issuance">
            Issuance
          </Link>
        </div>
      )}

      <div className="flex ml-auto items-center gap-2">
        {user && (
          <div className="text-sm border border-gray-200 rounded-full px-1 pr-3 py-1 flex items-center gap-2">
            <img
              src="https://api.dicebear.com/9.x/glass/svg"
              alt=""
              className="w-5 h-5 rounded-full"
            />
            <p>{user.email}</p>
          </div>
        )}

        {user && (
          <button
            onClick={logout}
            className="cursor-pointer items-center flex hover:bg-red-500 hover:text-white bg-red-100 rounded-2xl text-red-700 bg-text px-4 py-1.5 font-semibold text-xs"
          >
            <LogOut className="mr-1 h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Log Out</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
