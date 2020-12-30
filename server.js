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
    writeJsonFile(questions);

    res.json({
      question: req.body
    });
  }
});

app.post("/question/:question_id", (req, res) => {
  if(req.body.option === undefined || req.body.isCorrect === undefined){
    res.status(400).json({message: "Please pass a valid option"});
  } else {
    const questions = readJsonFile();
    const questionIndex = questions.findIndex(q => q.id == req.params.question_id);
    if(questionIndex === -1) {
      res.status(400).json({message: "Question not found"})
    } else {
      req.body.id = new Date().getTime();
      if(questions[questionIndex].options){
        questions[questionIndex].options.push(req.body);
      } else {
        questions[questionIndex].options = [];
        questions[questionIndex].options.push(req.body);
      }
      res.json({options: questions[questionIndex].options});
      writeJsonFile(questions);
    }
  }
});

app.post('/answer/:question_id/:option_id', (req, res) => {
  console.log(req.params.question_id, req.params.option_id);
  const questions = readJsonFile();
  const questionIndex = questions.findIndex(q => q.id == req.params.question_id);
  if(questionIndex === -1 ){
    res.status(400).json({message: "Question not found"});
  } else {
    if(questions[questionIndex].options){
      const optionIndex = questions[questionIndex].options.findIndex(option => option.id == req.params.option_id);
      if(optionIndex === -1 ){
        res.status(400).json({message: "Option not found"});
      } else {
        console.log('option value',questions[questionIndex].options[optionIndex]);
        if(questions[questionIndex].options[optionIndex].isCorrect){
          res.json({option: "Correct"});
        } else {
          res.json({option: "Wrong"});
        }
        
      }
    }
  }
  //console.log(questionIndex, questions[questionIndex]);
  //res.json({question : questions[questionIndex]});
})

app.get("/questions", (req, res)=> {
  const questionsWithOptions = readJsonFile();
  const processedQuestions = processQuestionsWithOptions(questionsWithOptions);
  res.json(processedQuestions);
});

app.get("/question/:question_id", (req, res)=>{
  const jsonQuestionsData = readJsonFile();
  const question = jsonQuestionsData.find(q => {
    return q.id == req.params.question_id;
  });
  res.json({question: question});
})

function readJsonFile(){
  const rawQuestionsData = fs.readFileSync('questions.json');
  const jsonQuestionsData = JSON.parse(rawQuestionsData);
  return jsonQuestionsData;
}

function writeJsonFile(questions){
  const data = JSON.stringify(questions, null, 2);
  fs.writeFileSync("questions.json",data);
}

function processQuestionsWithOptions(questionsWithOptions){
  
  questionsWithOptions.forEach(q => {
    console.log(q);
    if(q.options){
      q.options.forEach(option => option.isCorrect = null);
    }
  })
  return questionsWithOptions;
}