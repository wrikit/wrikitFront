import Login from "./components/Login";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import Document from "./pages/Document";
import "./styles/App.scss";

function App() {
  try {
    axios
      .post(
        "http://115.85.180.7:8000/auth/login/",
        {
          username: "user1",
          userpass: "user1pass",
        },
        {
          withCredentials: true,
        }
      )
      .then((result) => {
        console.dir(result);
        console.log(result.cookie);
      });
  } catch (error) {
    console.log("asdf");
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/document" element={<Document />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
