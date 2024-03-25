import React from "react";

function Account(props) {
  return (

    <li><p className="dropdown-item" onClick={props.onClick}>{props.name}</p></li>

  );
}

export default Account;