import Login from "./components/Login";
import "./styles/App.scss"
import axios from "axios"



function App() {
  try {
    axios.post("http://115.85.180.7:8000/auth/login/",
      {
        "username": "user1",
        "userpass": "user1pass"
      }, {
        withCredentials: true
      }).then(result => {
      console.dir(result)
      console.log(result.cookie)
    })
  } catch (error) {
    console.log('asdf'); 
  }
  return (
    <div className="App">
      <Login/>
    </div>
  );
}

export default App;
