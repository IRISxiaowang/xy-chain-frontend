import React from 'react';

function InteractorSubmit({ api, setStatus, palletRpc, callable, inputParams, currentUser }) {
  // Function to submit the extrinsic
  const submitExtrinsic = async () => {
    // Check for necessary selections
    if (!api || !palletRpc || !callable || !inputParams.length) {
      setStatus('Missing required information for transaction.');
      return;
    }

    // Assuming api.currentSigner is the selected account injected by Polkadot{.js} extension
    const signer = currentUser;

    if (!signer) {
      setStatus('No signer account selected.');
      return;
    }

    try {
      // Construct the extrinsic with selected callable and input parameters
      const extrinsic = api.tx[palletRpc][callable](...inputParams.map(param => param.value));

      // Sign and send the extrinsic, providing feedback through status updates
      await extrinsic.signAndSend(signer.keyPair, ({ status, dispatchError }) => {
        if (status.isInBlock) {
          setStatus(`Transaction included in block ${status.asInBlock.toString()}`);
        } else if (status.isFinalized) {
          setStatus(`Transaction finalized in block ${status.asFinalized.toString()}`);
          // Handle dispatch errors (if any)
          if (dispatchError) {
            if (dispatchError.isModule) {
              // For module errors, we have the section indexed, lookup
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              const { docs, name, section } = decoded;
              setStatus(`${section}.${name}: ${docs.join(' ')}`);
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              setStatus(dispatchError.toString());
            }
          }
        }
      });
    } catch (error) {
      console.error('Error submitting extrinsic:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <button className="submit-button" onClick={submitExtrinsic} style={{ cursor: 'pointer', borderRadius: '5px' }}>
        Submit Extrinsic
      </button>
    </div>
  );
}

export default InteractorSubmit;
