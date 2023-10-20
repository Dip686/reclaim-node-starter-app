import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk';
import express from 'express';

const reclaim = new reclaimprotocol.Reclaim();
const app = express();
const port = 3001;

app.get("/request-proofs", async(req, res) => {
  
  /**
   * Create or use the existing provider
   * To demo a working solution, we are using swiggy-total-count provider
   */
  const provider = new reclaim.CustomProvider({
    "provider": "swiggy-total-count",
      payload: {}
  });

  // replace the ip address with your ip address.
  const IP = `http://192.168.43.75:${port}`;

  // Add suitable title based on the use case
  const title = 'Get Swiggy Coupon for extra 20% off';
  // Add context message based on the use case
  const contextMessage = 'get extra 20% off if you have ordered at least 10times in Swiggy!';

  const request = reclaim.requestProofs({
      title: title,
      baseCallbackUrl: `${IP}/callback`,
      contextMessage: contextMessage,
      requestedProofs: [provider],
  });

  const reclaimUrl = await request.getReclaimUrl();
  // Store the callback Id and Reclaim URL in your database
  // ...
  res.json({ reclaimUrl });
   // display this reclaimUrl as a QR code on laptop or as a link on mobile devices for users to initiate creating proofs
});

app.use(express.text({ type: "*/*" }));
app.post("/callback", async (req, res) => {
  try {
    // Retrieve the callback ID from the URL parameters
    const callbackId = req.query.callbackId;
 
    // Retrieve the proofs from the request body
    const proofs = reclaimprotocol.utils.getProofsFromRequestBody(req.body)
 
    // Verify the correctness of the proofs (optional but recommended)
    const isProofsCorrect = await reclaim.verifyCorrectnessOfProofs(callbackId, proofs);
 
    if (isProofsCorrect) {
      // Proofs are correct, handle them as needed
      // ... business logic goes here
 
      // Respond with a success message
      res.json({ coupon: 'EXTRA_20' });
    } else {
      // Proofs are not correct or verification failed
      // ... handle the error accordingly
 
      // Respond with an error message
      res.status(400).json({ error: "Proofs verification failed" });
    }
  } catch (error) {
    console.error("Error processing callback:", error);
    res.status(500).json({ error: "Failed to process callback" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})