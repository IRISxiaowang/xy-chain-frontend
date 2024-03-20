// src/hooks/useSubstrate.js
import {Keyring} from '@polkadot/keyring';
import { useState, useEffect } from 'react';
import * as util from './util.js';

const useSubstrate = () => {
  const [api, setApi] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(async () => {
      const api = await util.getApi();
      console.log(api); 
      setApi(api);

      let keyring = new Keyring({ type: 'sr25519' });
      let alice = keyring.addFromUri('//Alice');
      let bob = keyring.addFromUri('//Bob');
      let charlie = keyring.addFromUri('//Charlie');
      
      setAccounts([
        {
          key: 1,
          name: 'Alice',
          keyPair: alice,
        },
        {
          key: 2,
          name: 'Bob',
          keyPair: bob,
        },
        {
          key: 3,
          name: 'Charlie',
          keyPair: charlie,
        },
      ]);

  }, []);

  return { api, accounts };
};

export default useSubstrate;
