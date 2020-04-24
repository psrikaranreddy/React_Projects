
import React, { Component } from "react"; 
import ReactDOM from "react-dom"; 
import "./assets/style.css";
import QuestionBox from "./components/QuestionBox";
import quizService from "./quizService";
import Result from "./components/result";

// quizbee is a class which is root component
class QuizBee extends Component {
  //initiating the local state for this component with an array questionbank where 5 question will be stored once pulled from API
  // the build system here uses bable compiler
  state = {
    questionBank: [],
    score: 0,
    responses: 0
  };
  // function getquestions invokes the quizService API and updates the state variable questionBank with results
  getQuestions = () => {
    quizService().then(question => {
      this.setState({
        questionBank: question
      });
    });
  };
  computeAnswer = (answer, correctAnswer) => {
    if (answer === correctAnswer) {
      this.setState({
        score: this.state.score + 1
      });
    }
    this.setState({
      responses: this.state.responses < 5 ? this.state.responses + 1 : 5
    });
  };

  playAgain = () => {
    this.getQuestions();
    this.setState({
      score: 0,
      responses: 0
    });
  };

  componentDidMount() {
    this.getQuestions();
  }

  // this method will return jsx template that will render on the page
  render() {
    return (
      <div className="container">
        <div className="title">QuizBee</div>
        {this.state.questionBank.length > 0 &&
        this.state.responses < 5 && // condition to disappear page after answering all five questions
          this.state.questionBank.map(
            ({ question, answers, correct, questionId }) => (
              <QuestionBox
                question={question}
                options={answers}
                key={questionId}
                selected={answer => this.computeAnswer(answer, correct)}
              />
            )
          )}
        {this.state.responses === 5 ? (
          <Result score={this.state.score} playAgain={this.playAgain} />
        ) : null}
      </div>
    );
  }
}

ReactDOM.render(<QuizBee />, document.getElementById("root"));
