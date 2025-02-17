import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import themeContext from "./utils/themeContext.js";

import {
  ChannelDetails,
  Feed,
  Navbar,
  SearchFeed,
  VideoDetails,
} from "./components";

function App() {
  const [theme, Settheme] = useState({
    themeColor: "#C21010",
    themeBg: "#000",
    textColor: "#fff",
  });
  const [darkIcon, SetdarkIcon] = useState();

  useEffect(() => {
    if (localStorage.getItem("miver-theme") === null)
      localStorage.setItem("miver-theme", "dark");
    const themeFromLs = localStorage.getItem("miver-theme");

    themeFromLs === "dark"
      ? Settheme({ themeColor: "#C21010", themeBg: "#000", textColor: "#fff" })
      : Settheme({ themeColor: "#C21010", themeBg: "#fff", textColor: "#000" });

    themeFromLs === "dark" ? SetdarkIcon(true) : SetdarkIcon(false);
  }, []);

  return (
    <Router>
      <themeContext.Provider
        value={{
          theme: theme,
          Settheme: Settheme,
          darkIcon: darkIcon,
          SetdarkIcon: SetdarkIcon,
        }}
      >
        <Box
          sx={{
            backgroundColor: `${theme.themeBg}`,
            color: `${theme.textColor}`,
          }}
        >
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Feed />} />
            {/* <Route exact path="/history/:id" element={<History/>}/> */} Next Update V6.1.2
            <Route exact path="/video/:id" element={<VideoDetails />} />
            <Route exact path="/channel/:id" element={<ChannelDetails />} />
            <Route exact path="/search/:search" element={<SearchFeed />} />
          </Routes>
        </Box>
      </themeContext.Provider>
    </Router>
  );
}

export default App;
