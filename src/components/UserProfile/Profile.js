import ProfileForm from "./ProfileForm";
import axios from "axios";
import { useState, useEffect } from "react";

const Profile = props => {
  const [name, setName] = useState(false);
  const [message, setMessage] = useState();
  const [src, setSrc] = useState();

  useEffect(() => {
  const getData = async () => {
    axios.post(
      "http://localhost:8000/main/get-profile/",
      {}, 
      { withCredentials:true})
      .then(res => {
        setName(res.data.data.profileName);
        setMessage(res.data.data.profileMessage);
        setSrc("http://localhost:8000/media/user_profile/"+res.data.data.profileImg);  
      });
    }
  getData();
  }, []);

  return <div>
     {name ? (
      <ProfileForm 
        profileName={name}
        profileMessage={message}
        src={src}  
      />
     ) : (
      <div>Loading...</div>
     )}
  </div>;
 
  
}

export default Profile;