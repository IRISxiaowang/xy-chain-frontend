// src/App.js
import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import useSubstrate from './hooks/useSubstrate';
import AccountSelector from './AccountSelector';
import DisplayBalance from './DisplayBalance';
import BlockNumber from './BlockNumber';
import Extrinsic from './Extrinsic';

function App() {
  const { api, accounts } = useSubstrate();

  const [buttonLabel, setButtonLabel] = useState('Choose a user');
  const [buttonClass, setButtonClass] = useState('btn btn-secondary dropdown-toggle');
  const [currentUser, setCurrentUser] = useState(null);

  const handleClick = account => () => {
    setButtonLabel(account.name);
    setCurrentUser(account);
    setButtonClass("btn btn-info dropdown-toggle");
  };
  return (
    <Container className="app-container body-font">
      <h3>XY-Chain</h3>
      {api && accounts.length > 0 ? (
        <>
          <div className="header">
            <BlockNumber api={api} />

            <AccountSelector
              api={api}
              accounts={accounts}
              buttonClass={buttonClass}
              buttonLabel={buttonLabel}
              handleClick={handleClick}
              currentUser={currentUser}
            />
            <DisplayBalance api={api} currentUser={currentUser} />
          </div>

          <div className="extrinsic-container">
            <Extrinsic api={api} currentUser={currentUser} />
          </div>
        </>
      ) : (
        <p>Loading or no accounts found. Please ensure the Polkadot.js extension is installed and accounts are created.</p>
      )}
    </Container>
  );
}

export default App;
