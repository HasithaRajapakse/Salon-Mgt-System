import { useState } from "react";
import "./Adminapp.css";
import Navigation from "./Navigation";
import Main from "./Main";
import { ThemeContext } from "./ThemeContext";

function AdminappTemplate() {
  const [DarkTheme, setDarkTheme] = useState(true);

  return (
    <ThemeContext.Provider value={{ DarkTheme, setDarkTheme }}>
      <div className="Adminapp">
        
          <Navigation />
          <Main />
          
      </div>
    </ThemeContext.Provider>
  );
}

export default AdminappTemplate;

