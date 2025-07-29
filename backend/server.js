const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Research Hub API Running');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
