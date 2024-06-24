const dotenv = require('dotenv');
// const express = require('express');
const Turn = require('node-turn');


// Load environment variables from .env file
dotenv.config();

// const app = express();
const port = process.env.PORT || 3003;

// Set up the TURN server
const turnServer = new Turn({
  // Set the listening ports for UDP and TCP
  listeningIps: ['0.0.0.0'],
  externalIps: [process.env.EXTERNAL_IP],  // Add public IP
  listeningPort: process.env.TURN_PORT || 3478,
  // tlsListeningPort: process.env.TURN_TLS_PORT || 5349,
  tlsOptions: null,
  // Enable TCP and UDP support
  udpRelayPortRange: [60000, 60010],
  tcpRelayPortRange: [60000, 60010],
  authMech: 'long-term',
  credentials: {
    [process.env.TURN_USERNAME]: process.env.TURN_PASSWORD
  },
    debugLevel: 'ALL',
    // realm: process.env.TURN_REALM,
});

console.log('TURN server username:', process.env.TURN_USERNAME);
console.log('TURN server password:', process.env.TURN_PASSWORD);
console.log(`TURN_PORT: ${process.env.TURN_PORT}`);


turnServer.on('error', (err) => {
  console.error('TURN Server Error:', err);
});

turnServer.on('traffic', (data) => {
  console.log('TURN Traffic:', data);
});

// Start the TURN server
// turnServer.start();
turnServer.start();

// app.get('/', (req, res) => {
//   res.send('TURN server is running');
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
