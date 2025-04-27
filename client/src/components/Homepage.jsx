import React, { useState } from "react";
import "../styles/Homepage.css";
import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../providers/user";
import { v4 } from "uuid";

const Homepage = () => {
  const [fieldValues, setFieldValues] = useState({});
  const navigateTo = useNavigate();
  const { setUser } = useUserDetails();

  const handleChange = (e) => {
    setFieldValues((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  const onClick = () => {
    const id = v4();
    setUser(id, fieldValues);
    navigateTo(id);
  };

  return (
    <div className="hompage-container">
      <div className="input-container">
        <input
          name="emailId"
          type="text"
          placeholder="Enter your email here"
          onChange={handleChange}
          value={fieldValues["emailId"] ?? ""}
        />
        <input
          name="roomId"
          type="text"
          placeholder="Enter room code"
          onChange={handleChange}
          value={fieldValues["roomId"] ?? ""}
        />
        <button type="button" onClick={onClick}>
          Enter Room
        </button>
      </div>
    </div>
  );
};

export default Homepage;
