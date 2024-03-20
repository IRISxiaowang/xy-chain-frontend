import React from 'react';
import Account from './Account';

function AccountSelector({ accounts, buttonClass, buttonLabel, handleClick, currentUser }){

    return(
    <>
    <div className="dropdown">
    <p>Current user</p>
    <button id="dropbtn" className={buttonClass} type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {buttonLabel}
    </button>
    <ul className="dropdown-menu">
    {accounts.map(account => <Account onClick={handleClick(account)} key={account.key} name={account.name}/>)}
    </ul>
    {currentUser && <label style={{ fontFamily: 'Arial, sans-serif' }}>{currentUser.keyPair.address}</label>}
    </div> 
    </>);

}

export default AccountSelector;