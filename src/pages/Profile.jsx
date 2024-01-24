import React from "react";
import axios from 'axios'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {

  let { id } = useParams();
  const [username, setUsername] = useState("")

  useEffect(() => {
    axios.get(`http://react-back.azurewebsites.net/user/user-info/${id}`).then((response) => {
      setUsername(response.data.userName)
    })
  }, [])

  return (
    <div>
      <div>
        <h2>Username: {username}</h2>
      </div>
      <div></div>
    </div>
  );
};

export default Profile;
