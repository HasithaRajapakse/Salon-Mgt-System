import "./Nav.css";
import { BiChevronDown } from 'react-icons/bi'; const Nav = ({ Icon, title, onClick }) => {
  return (
    <div className="nav" onClick={onClick}>
      {Icon && <Icon className="icon" />}
      <h2>{title ? title : null}</h2>
      <BiChevronDown className="arrow-icon"  style={{ marginLeft: 'auto' }}/> {/* Arrow down icon */}
    </div>
  );
};

export default Nav;
