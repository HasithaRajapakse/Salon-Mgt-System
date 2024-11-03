import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { useNavigate } from "react-router-dom"; 
import "./Header.css";
import { BiSearch } from "react-icons/bi";
import { MdNotificationsNone, MdOutlineFeedback } from "react-icons/md";
import { GrSettingsOption } from "react-icons/gr";
import { IoAnalytics } from "react-icons/io5";
import { HiOutlineMoon, HiOutlineLogout } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";

const Header = () => {
  const { DarkTheme, setDarkTheme } = useContext(ThemeContext);
  const navigate = useNavigate(); 

  function changeTheme() {
    setDarkTheme(!DarkTheme);
  }

  function handleLogout() {
    // Clear local storage
    localStorage.clear();
    // Navigate to the login page
    navigate('/Login');
  }

  return (
    <header className={`${DarkTheme && "dark"}`}>
      <div className="search-bar1">
        <input type="text" placeholder="search..." />
        <BiSearch className="icon" />
      </div>

      <div className="tools">
        <MdNotificationsNone className="icon" />
        

        <div className="divider"></div>

        <HiOutlineMoon className="icon" onClick={changeTheme} />
        <GrSettingsOption className="icon" />
        <LuLogOut className="icon" onClick={handleLogout} /> {/* Add onClick event for logout */}

        <div className="divider"></div>

        <div className="user">
          <img src alt="" className="profile-img" />
        </div>
      </div>
    </header>
  );
};

export default Header;
