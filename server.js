const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
app.listen(4000);

app.use(bodyParser.json());

// let questions = [];

app.post("/question", (req, res) => {
  if(req.body.question === undefined || req.body.question === ''){
    res.status(400).json({message: "Please pass question"});
  } else {
    req.body.id = new Date().getTime();
    const questions = readJsonFile();
    questions.push(req.body);
    const data = JSON.stringify(questions, null, 2);
    fs.writeFileSync("questions.json",data);

    res.json({
      question: req.body
    });
  }
});

app.get("/questions", (req, res)=> {
  res.json(readJsonFile());
});

app.get("/question/:question_id", (req, res)=>{
  // console.log(questions, req.params.question_id);
  const jsonQuestionsData = readJsonFile();
  const question = jsonQuestionsData.find(q => {
    return q.id == req.params.question_id;
  });
  // console.log(question);
  res.json({question: question});
})

function readJsonFile(){
  const rawQuestionsData = fs.readFileSync('questions.json');
  const jsonQuestionsData = JSON.parse(rawQuestionsData);
  return jsonQuestionsData;
}