const express = require('express');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell'); // Import PythonShell
const port = process.env.PORT || 3002;
const url = process.env.URL;
const path = require('path');
const app = express();
app.use(bodyParser.json());
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin:["https://deploy-mern-lwhq.vercel.app"],
    methods:["POST","GET"],
    credentials: true
  }
));

app.post('/exam', (req, res) => {
  const { toughness, hour, consist, syllabus, time } = req.body;

  console.log('Toughness:', toughness);
  const pythonScriptPath = path.join(__dirname, 'scripts', 'logisticRegression.py');

  const options = {
    mode: 'text',
    pythonPath: 'python', // or 'python3' depending on your system
    pythonOptions: ['-u'], // unbuffered output
    scriptPath: path.dirname(pythonScriptPath),
    args: [toughness, hour, consist, syllabus, time],
  };

  PythonShell.run(path.basename(pythonScriptPath), options, (err, results) => {
    if (err) {
      console.log('Python error:', err);
      res.status(500).send({ error: err });
    } else {
      console.log('Python output:', results);
      res.send({ output: results });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is ng on port ${port}`);
  console.log(`${url}`);
});
