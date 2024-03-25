import React, { useEffect, useState } from 'react'
import { Form, Input, Label } from 'semantic-ui-react'
import InteractorSubmit from './InteractorSubmit'

const argIsOptional = arg => arg.type.toString().startsWith('Option<')

function Main({ api, currentUser }) {
  const [status, setStatus] = useState(null)

  const [palletRPCs, setPalletRPCs] = useState([])
  const [callables, setCallables] = useState([])
  const [paramFields, setParamFields] = useState([])

  const initFormState = {
    palletRpc: '',
    callable: '',
    inputParams: [],
  }

  const [formState, setFormState] = useState(initFormState)
  const { palletRpc, callable, inputParams } = formState


  const updatePalletRPCs = () => {
    if (!api) {
      return
    }
    const apiType = api.tx;
    const palletRPCs = Object.keys(apiType)
      .sort()
      .filter(pr => Object.keys(apiType[pr]).length > 0)
      .map(pr => ({ key: pr, value: pr, text: pr }))
    setPalletRPCs(palletRPCs)
    console.log(palletRPCs);
  }

  const updateCallables = () => {
    if (!api || palletRpc === '') {
      return
    }
    const callables = Object.keys(api.tx[palletRpc])
      .sort()
      .map(c => ({ key: c, value: c, text: c }))
    setCallables(callables)
  }

  const updateParamFields = () => {
    if (!api || palletRpc === '' || callable === '') {
      setParamFields([])
      return
    }

    let paramFields = []


    const metaArgs = api.tx[palletRpc][callable].meta.args

    if (metaArgs && metaArgs.length > 0) {
      paramFields = metaArgs.map(arg => ({
        name: arg.name.toString(),
        type: arg.type.toString(),
        optional: argIsOptional(arg),
      }))
    }


    setParamFields(paramFields)
  }

  useEffect(updatePalletRPCs, [api])
  useEffect(updateCallables, [api, palletRpc])
  useEffect(updateParamFields, [api, palletRpc, callable])

  const onPalletCallableParamChange = (event) => {
    const newState = event.target.getAttribute('state'); // Using getAttribute to access data-* attributes
    const newValue = event.target.value;

    setFormState((prevState) => {
      let newInputParams = [...prevState.inputParams];

      if (newState === 'palletRpc') {
        return { ...prevState, palletRpc: newValue, callable: '', inputParams: [] };
      } else if (newState === 'callable') {
        return { ...prevState, callable: newValue, inputParams: [] };
      } else if (newState) {
        // Assuming newState here is an index for inputParams
        const index = parseInt(newState, 10); // newState should be the index of the input param
        newInputParams[index] = { ...newInputParams[index], value: newValue };
        return { ...prevState, inputParams: newInputParams };
      }

      return prevState; // In case newState is not recognized
    });
  }

  const onInputChange = (index, newValue) => {
    // Update the inputParams part of the formState
    const updatedInputParams = [...inputParams];
    updatedInputParams[index] = { ...updatedInputParams[index], value: newValue };

    setFormState(prevState => ({
      ...prevState,
      inputParams: updatedInputParams,
    }));
  };


  return (

    <Form>
      <label>EXTRINSIC CALL</label>

      <select className="custom-select" state="palletRpc" onChange={onPalletCallableParamChange}>
        <option value=''>Choose a pallet</option>
        {palletRPCs.map(palletRpc => <option key={palletRpc.key} value={palletRpc.key} >{palletRpc.text}</option>)}
      </select>

      <select className="custom-select" state="callable" onChange={onPalletCallableParamChange}>
        <option value=''>Choose a call</option>
        {callables.map(callable => <option key={callable.key} value={callable.key} >{callable.text}</option>)}
      </select>


      {paramFields.map((paramField, ind) => (
        <Form.Field key={`${paramField.name}-${paramField.type}`}>
          <Input
            placeholder={paramField.type}
            fluid
            type="text"
            label={paramField.name}
            state={{ ind, paramField }}
            value={inputParams[ind] ? inputParams[ind].value : ''}
            onChange={e => onInputChange(ind, e.target.value)}
          />
          {paramField.optional ? (
            <Label
              basic
              pointing
              color="teal"
            />
          ) : null}
        </Form.Field>
      ))}
      <Form.Field style={{ textAlign: 'right' }}>
        <InteractorSubmit
          setStatus={setStatus}
          api={api}
          palletRpc={palletRpc}
          callable={callable}
          inputParams={inputParams}
          currentUser={currentUser}
        />
      </Form.Field>
      <div style={{
        overflowWrap: 'break-word', display: 'flex', justify_content: 'space-between',
        width: '100%', margin_top: '20px'
      }}>{status}</div>
    </Form>
  )
}


export default function Extrinsic({ api, currentUser }) {
  return api.tx ? <Main api={api} currentUser={currentUser} /> : null
}
