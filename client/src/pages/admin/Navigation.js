import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import Nav from "./Nav";
import "./Navigation.css";
import { FiChevronLeft } from "react-icons/fi";
import { TbDashboard, TbBrandBooking } from "react-icons/tb";
import { FaWallet } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { GrSettingsOption } from "react-icons/gr";
import { FaServicestack } from "react-icons/fa6";
import { MdSwapHoriz, MdOutlineManageAccounts, MdQueryStats, MdOutlineFeedback } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { BiMessageAltAdd, BiDotsHorizontalRounded } from "react-icons/bi";

import { ThemeContext } from "./ThemeContext";
import Dropdown from './Dropdown';

const Navigation = () => {
  const [nav, setNav] = useState(false);
  const [dropdownStates, setDropdownStates] = useState(Array(10).fill(false)); // Initialize dropdown states
  const { DarkTheme, setDarkTheme } = useContext(ThemeContext);
  const [adminId, setAdminId] = useState('');
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Fetch admin details from local storage
    const storedAdminId = localStorage.getItem('adminId');
    const storedAdminName = localStorage.getItem('adminName');

    setAdminId(storedAdminId);
    setAdminName(storedAdminName);
  }, []);

  function changeTheme() {
    setDarkTheme(!DarkTheme);
  }

  const toggleDropdown = (index) => {
    setDropdownStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className={`navigation ${nav && "active"} ${DarkTheme && "dark"}`}>
      <div
        className={`menu ${nav && "active"}`}
        onClick={() => {
          setNav((prevState) => !prevState);
        }}
      >
        <FiChevronLeft className="menu-icon" />
      </div>

      <header>
        <div className="profile">
          <img alt="user" className="profile-img" />
        </div>
        <span>{adminName} (ID: {adminId})</span> {/* Display admin name and ID */}
      </header>

      <Nav Icon={TbDashboard} title={'Dashboard'} onClick={() => toggleDropdown(0)} />
      {dropdownStates[0] && (
        <Dropdown
          items={[
            { text: 'View Dashboard', url: '/AdminViewDashboard' },
        
          ]}
        />
      )}

      <Nav Icon={FaServicestack} title={"Services"} onClick={() => toggleDropdown(1)} />
      {dropdownStates[1] && (
        <Dropdown items={[
          { text: 'View/Edit Services', url: '/AdminViewServices' },
          { text: 'Add Services', url: '/AdminAddServices' },
        ]} />
      )}

      <Nav Icon={MdOutlineManageAccounts} title={"Staff"} onClick={() => toggleDropdown(2)} />
      {dropdownStates[2] && (
        <Dropdown items={[
          { text: 'View/Edit Staff', url: '/AdminViewStaff' },
          { text: 'Add Staff', url: '/AdminAddStaff' },
          { text: 'Leave Managemnet', url: '/AdminAddLeave' },
        ]} />
      )}

      <Nav Icon={IoIosPeople} title={"Customers"} onClick={() => toggleDropdown(3)} />
      {dropdownStates[3] && (
        <Dropdown items={[
          { text: 'View Customers', url: '/AdminViewCustomers' },
        ]} />
      )}

      <div className="divider"></div>



      <Nav Icon={TbBrandBooking} title={"Bookings"} onClick={() => toggleDropdown(4)} />
      {dropdownStates[4] && (
        <Dropdown items={[
          { text: 'Bookings', url: '/AdminBookings' },
          { text: 'Complete a Booking', url: '/AdminCompleteBooking' },
        ]} />
      )}


      <Nav Icon={FaWallet} title={"Payments"} onClick={() => toggleDropdown(5)} />
      {dropdownStates[5] && (
        <Dropdown items={[
          { text: 'Payments', url: '/AdminPayments' },
        ]} />
      )}


      <Nav Icon={MdQueryStats} title={"Analysis"} onClick={() => toggleDropdown(6)} />
      {dropdownStates[6] && <Dropdown items={['View Analysis', 'Export Analysis']} />}

      <Nav Icon={MdOutlineFeedback} title={"Feedbacks"} onClick={() => toggleDropdown(7)} />
      {dropdownStates[7] && <Dropdown items={['View Feedbacks', 'Respond to Feedbacks']} />}

      <Nav Icon={SlOptions} title={"Other"} onClick={() => toggleDropdown(8)} />
      {dropdownStates[8] && <Dropdown items={['Option 1', 'Option 2', 'Option 3']} />}

      <Nav Icon={GrSettingsOption} title={"Settings"} onClick={() => toggleDropdown(9)} />
      {dropdownStates[9] && (
        <Dropdown items={['General Settings', 'Security Settings', 'Notification Settings']} />
      )}

      <div className="divider"></div>


      <svg
        className="bg-waves"
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fill: "#ffffff",
          width: "265%",
          height: 195,
          transform: "scaleX(-1)",
        }}
      >
        <path
          d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
          opacity=".25"
        />
        <path
          d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z"
          opacity=".5"
        />
        <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
      </svg>
    </div>
  );
};

export default Navigation;
