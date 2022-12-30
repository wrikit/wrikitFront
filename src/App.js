import Login from "./components/Login";
import Resister from "./components/Resister";
import "./styles/App.scss"
import axios from "axios";
import TextEditor from "./components/TextEditor";

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
      <Login />
      <Resister/>
      <TextEditor />
    </div>
  );
}

export default App;
