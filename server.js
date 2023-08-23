const express = require('express');
const bodyParser = require('body-parser');
const {spawn}= require('child_process');
const port = process.env.PORT || 3002;
const url= process.env.URL;
const path =require('path');
const app = express();
app.use(bodyParser.json());
const cors=require('cors');



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.post('/tennis', (req, res) => {
  // Handle the request here
  const {outlook,temperature, humidity,windy}= req.body;
  
  console.log(outlook);
  
  const pythonScriptPath = path.join(__dirname, '..', 'server', 'scripts', 'logisticRegression.py');
  const scriptDirectory = path.dirname(pythonScriptPath);
  
  const pythonProcess = spawn('python', [pythonScriptPath, outlook, temperature, humidity, windy], {
      cwd: scriptDirectory
  });
  


pythonProcess.stdout.on('data',(data)=>{
  const output =data.toString();
  
  console.log('python output:',output);
  res.status(200).json({output:output})
});

pythonProcess.stderr.on('data',(data)=>{
  const errors = data.toString();
  console.log('python error:',errors);
});
pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);

 
});

});

app.post('/exam', (req, res) => {
  const { toughness, hour, consist, syllabus, time } = req.body;
  

console.log('Toughness:', toughness);
const exam_path= path.join(__dirname, '..', 'server', 'scripts', 'Exam_prediction.py');
const ExamProcess=spawn('Python',[exam_path,toughness,hour,consist,syllabus,time]);

ExamProcess.stdout.on('data',(data)=>{
const output= data.toString();
console.log('Python output:',output);
res.status(200).json({output:output});
});
ExamProcess.stderr.on('data',(data)=>{
  const error=data.toString();
  console.log('Python error:',error);
});
ExamProcess.on('close',(code)=>{
  console.log(`python process execute with code ${code}`);
});

});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`${url}`);
});
