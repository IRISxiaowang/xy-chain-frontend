// src/App.js
import React, { useState } from 'react';
import { Container} from 'semantic-ui-react';
import useSubstrate from './hooks/useSubstrate';
import AccountSelector from './AccountSelector';
import DisplayBalance from './DisplayBalance';
import BlockNumber from './BlockNumber';

// import MakeExtrinsicCall from './components/MakeExtrinsicCall';

function App() {
  const { api, accounts } = useSubstrate();
//   const [selectedAccount, setSelectedAccount] = useState(null);

//   const handleAccountChange = (_, data) => {
//     setSelectedAccount(data.value);
//   };

const [buttonLabel, setButtonLabel] = useState('Choose a user');
const [buttonClass, setButtonClass] = useState('btn btn-secondary dropdown-toggle');
const [currentUser, setCurrentUser] = useState(null);

const handleClick  = account => () => {
    setButtonLabel(account.name);
    setCurrentUser(account);
    setButtonClass("btn btn-info dropdown-toggle");
};
  return (
    <Container>
      <h1>XY-Chain</h1>
      {api && accounts.length > 0 ? (
        <>
      
        <BlockNumber api={api}/>
     
        <AccountSelector
            accounts={accounts}
            buttonClass={buttonClass}
            buttonLabel={buttonLabel}
            handleClick={handleClick}
            currentUser={currentUser}
          />
        <DisplayBalance api={api} currentUser={currentUser}/>
        </> 
      ) : (
        <p>Loading or no accounts found. Please ensure the Polkadot.js extension is installed and accounts are created.</p>
      )}
    </Container>
  );
}

export default App;
