import React from "react";


function Account({ userEmail }) {
  return (
    <div>
      <h2>Welcome, {userEmail ? userEmail : "Guest"}</h2>
    </div>
  );
}

export default Account;
