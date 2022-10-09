// Basic
import { Component } from "react";

// Router
import {
  Routes,
  Route,
} from "react-router-dom";
import Create from "./pages/create";
import Login from "./pages/login";

// Pages
import Main from "./pages/main";
import Recover from "./pages/recover";

class App extends Component {
  render() {
    return (
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="*" element={<Main />} />
      </Routes>
    );
  }
}

export default App;