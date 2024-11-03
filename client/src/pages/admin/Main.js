import { useContext } from "react";
import Header from "./Header";

import { ThemeContext } from "./ThemeContext";
import "./Main.css";

const Main = () => {
  const { DarkTheme } = useContext(ThemeContext);

  return (
    <div className={`main ${DarkTheme && "dark"}`}>
      <Header />
    </div>
  );
};

export default Main;
