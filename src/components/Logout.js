import axios from "axios";

const Logout = () => {
  
  const reqLogout = () => {
    axios.post("http://localhost:8000/auth/logout/",
    {},
    { withCredentials: true })
    .then(res => {
      console.log(res);
    });
  }

  return (
    <div>
      <button onClick={reqLogout}>
        Logout
      </button>
    </div>
  )
}

export default Logout;
