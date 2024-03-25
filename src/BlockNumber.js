import React, { useState, useEffect } from 'react';
import { Statistic } from 'semantic-ui-react';

function BlockNumber({ api }) {
  const [blockNumber, setBlockNumber] = useState(0);
  const bestNumber = api.derive.chain.bestNumber;
  useEffect(() => {
    let unsubscribeAll = null

    bestNumber(number => {
      // Append `.toLocaleString('en-US')` to display a nice thousand-separated digit.
      setBlockNumber(number.toNumber().toLocaleString('en-US'))
    })
      .then(unsub => {
        unsubscribeAll = unsub
      })
      .catch(console.error)

    return () => unsubscribeAll && unsubscribeAll()
  }, [bestNumber]);

  return (
    <>
      <div className="block-info">
        <p className="block-label">Current block</p>
        <Statistic
          className="block-number"
          value={blockNumber}
        />
      </div>
    </>
  );

}

export default BlockNumber;