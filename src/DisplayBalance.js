import React, { useState, useEffect } from 'react';

const DisplayBalance = ({ api, currentUser }) => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (currentUser && api) {
        try {
          const result = await api.query.bank.accounts(currentUser.keyPair.publicKey);
          setBalance(result.free); // Assuming result.free contains the balance
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }, [api, currentUser]); // Re-fetch the balance when `api` or `currentUser` changes

  // Render the balance or a placeholder if it's not loaded yet
  return (
    <div className="balance">
      <p>Current balance</p>
      {balance !== null ? (
        <label style={{ fontFamily: 'Arial, sans-serif' }}>{balance.toString()}</label>
      ) : (
        <p>Loading balance...</p>
      )}
    </div>
  );
};

export default DisplayBalance;
