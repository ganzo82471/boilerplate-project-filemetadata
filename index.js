var express = require('express');
var cors = require('cors');
require('dotenv').config()

const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' }); 



app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});






app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define Mongoose schema and model (assuming you have MongoDB and Mongoose set up)
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  size: Number
});
const File = mongoose.model('File', fileSchema);

// POST /api/fileanalyse endpoint to handle file uploads
app.post('/api/fileanalyse', upload.single('upfile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { originalname, mimetype, size } = req.file;
    // Save file data to MongoDB
    const file = new File({
      filename: originalname,
      mimetype,
      size
    });
    await file.save();
    res.json({
      name: originalname,
      type: mimetype,
      size: size
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

