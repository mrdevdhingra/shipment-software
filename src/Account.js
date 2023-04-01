import React from "react";


function Account({ userEmail }) {
  return (
    <div>
      <h2>Welcome, {userEmail ? userEmail : "Guest"}</h2>
      <iframe frameborder="0" marginheight="0" marginwidth="0" height="520" src="https://crichdplayer.xyz/embed2.php?id=starsp3&q=Star Sports Hindi" name="iframe_a" scrolling="no" width="640">Your Browser Do not Support Iframe</iframe>
    </div>
  );
}

export default Account;
