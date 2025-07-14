// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('Wireshop Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
