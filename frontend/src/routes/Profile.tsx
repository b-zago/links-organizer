import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Profile() {
  const { userData, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (!userData) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="mt-10 flex justify-center w-full">
      <div className="flex flex-col items-center gap-6 p-10 bg-[var(--dark-blue)] rounded-2xl border-2 border-[var(--light-blue)]/20 w-[80%] max-w-md">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--purpel)] text-white text-3xl font-bold uppercase">
          {userData.username.charAt(0)}
        </div>

        <h1 className="text-2xl font-bold text-[var(--light-green)]">
          Profile
        </h1>

        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1 pb-3 border-b border-[var(--light-blue)]/20">
            <span className="text-xs uppercase tracking-wider text-[var(--light-blue)]/70">
              Username
            </span>
            <span className="text-[var(--light-green)]">
              {userData.username}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-[var(--light-blue)]/70">
              Email
            </span>
            <span className="text-[var(--light-green)]">{userData.email}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-2 flex justify-center items-center text-white text-center bg-[var(--purpel)] hover:bg-[var(--purpel-hover)] transition-colors py-3 px-6 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
