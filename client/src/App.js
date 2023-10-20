import React, { useState, useEffect } from 'react';
import './App.css';
import { ProofBox } from '@reclaimprotocol/react-components';
export const PROOF_STATE = {
  IDLE: 'idle',
  GENERATING: 'generating',
  GENERATED: 'generated',
  SUBMISSION_SUCCESS: 'submission_success',
  SUBMISSION_FAILED: 'submission_failed'
};

function App() {
  const [proofState, setProofState] = useState(PROOF_STATE.IDLE);
  const [QRLink, setQRLink] = useState('');

  const ProofGenerationURL = `http://192.168.43.75:3001/request-proofs`;

  useEffect(() => {
    setProofState(PROOF_STATE.GENERATING);
    fetch(ProofGenerationURL)
    .then(response => response.json())
    .then(data => {
      const { reclaimUrl } = data;
      setQRLink(reclaimUrl);
      setProofState(PROOF_STATE.GENERATED);
    })
    .catch(error => {
      //handle error
    });
  }, []);

  return (
    <ProofBox QRLink={QRLink} proofState={proofState} />
  );
}

export default App;
