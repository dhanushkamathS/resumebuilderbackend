const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; // Specify the desired port number

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.use('/api',require('./routes/api'))

// Add your routes or middleware here
app.get('/', (req, res) => {
  res.send('Hello, world!');
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
