import React from "react";

function Account(props) {
  return (
   
    <li><a className="dropdown-item" onClick={props.onClick}>{props.name}</a></li>
   
  );
}

export default Account;