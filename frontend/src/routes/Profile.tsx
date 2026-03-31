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
    <div className="mt-5 flex justify-center items-center flex-col gap-4">
      <h1>Profile</h1>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
      <button
        onClick={handleLogout}
        className="flex justify-center items-center text-[var(--light-green)] text-center bg-[var(--purpel)] py-3 px-4 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
