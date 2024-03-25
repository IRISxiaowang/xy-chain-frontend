import React, { useState, useEffect } from 'react';
import Account from './Account';

function AccountSelector({ api, accounts, buttonClass, buttonLabel, handleClick, currentUser }) {
    const [role, setRole] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            if (currentUser && api) {
                try {
                    const result = await api.query.roles.accountRoles(currentUser.keyPair.publicKey);
                    setRole(result); // Assuming result.free contains the balance
                } catch (error) {
                    console.error('Error fetching balance:', error);
                }
            }
        };

        fetchRole();
    }, [api, currentUser]);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <>
            <div className="dropdown">
                <p>Current user</p>
                <button className={buttonClass}
                    type="button"
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown}>
                    {buttonLabel}
                </button>
                <ul className={`dropdown-menu${isDropdownOpen ? " show" : ""}`}>
                    {accounts.map(account => <Account onClick={(e) => { handleClick(account)(); toggleDropdown(); }} key={account.key} name={account.name} />)}
                </ul>
            </div>
            <div>
                {currentUser &&
                    <div>
                        <p>{role ? role.toString() : 'Fetching role...'}</p>
                        <label style={{ fontFamily: 'Arial, sans-serif' }}>{currentUser.keyPair.address}</label>
                    </div>}
            </div>
        </>);

}

export default AccountSelector;