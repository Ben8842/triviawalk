import { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startButton: true,
      categoryDisplay: false,
      isLoaded: false,
      show: true,
      triviaData: [],
      count: 1,
      isCorrectChoice: false,
      isWrongChoice: false,
      triviaDone: false,
    };
  }

  returnHome() {
    this.setState({
      count: 1,
      triviaDone: false,
      startButton: true,
      show: false,
    });
  }

  incrementCount() {
    this.setState((state) => {
      if (state.count < 10) {
        return { count: state.count + 1 };
      } else return { triviaDone: true, show: false };
    });
  }

  nextTrivia() {
    this.setState({ isCorrectChoice: false, isWrongChoice: false, show: true });
    this.incrementCount();
  }

  isCorrect(ans) {
    var { triviaData, count } = this.state;

    if (atob(triviaData.results[count].correct_answer) === ans) {
      this.setState({
        isCorrectChoice: true,
        show: false,
      });
    } else {
      this.setState({
        isWrongChoice: true,
        show: false,
      });
    }
  }

  displayQuestion() {
    var { isLoaded, triviaData, count } = this.state;

    if (isLoaded) {
      var questionT = triviaData.results[count].question;
      var decodedStringAtoB = atob(questionT);
    } else {
      console.log("waiting");
    }

    const tQuestion = (
      <div>
        <p>{decodedStringAtoB}</p>
      </div>
    );
    return tQuestion;
  }

  displayAnswer() {
    var { isLoaded, triviaData, count } = this.state;

    if (isLoaded) {
      var firstAnswer = atob(triviaData.results[count].correct_answer);
      var secondAnswer = atob(triviaData.results[count].incorrect_answers[0]);
      var thirdAnswer = atob(triviaData.results[count].incorrect_answers[1]);
      var fourthAnswer = atob(triviaData.results[count].incorrect_answers[2]);

      function shuffle(arry) {
        arry.sort(() => Math.random() - 0.5);
      }

      let answerArr = [firstAnswer, secondAnswer, thirdAnswer, fourthAnswer];
      shuffle(answerArr);

      const tAnswers = (
        <div>
          <button onClick={() => this.isCorrect(answerArr[0])}>
            A. {answerArr[0]}
          </button>
          <button onClick={() => this.isCorrect(answerArr[1])}>
            B. {answerArr[1]}
          </button>
          <button onClick={() => this.isCorrect(answerArr[2])}>
            C. {answerArr[2]}
          </button>
          <button onClick={() => this.isCorrect(answerArr[3])}>
            D. {answerArr[3]}
          </button>
        </div>
      );
      return tAnswers;
    } else {
      console.log("waiting");
    }
  }

  handleStart() {
    this.setState({
      startButton: false,
      categoryDisplay: true,
    });
  }

  handleCatChoice(id) {
    fetch(
      "https://opentdb.com/api.php?amount=15&category=" +
        id +
        "&type=multiple&encode=base64"
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          triviaData: json,
          categoryDisplay: false,
          isLoaded: true,
          show: true,
        });
      });
  }

  render() {
    var {
      startButton,
      categoryDisplay,
      count,
      isLoaded,
      show,
      isCorrectChoice,
      isWrongChoice,
      triviaDone,
    } = this.state;

    const question = this.displayQuestion();
    const answer = this.displayAnswer();

    const questionBox = (
      <div>
        <p> Question {count} </p>
        <p>{question}</p>
        <p>Choose Your Answer</p>
        <p>{answer}</p>
      </div>
    );

    const triviaStartButton = (
      <div>
        <button onClick={() => this.handleStart()}>Start Trivia</button>
      </div>
    );

    const categoryChoices = (
      <div>
        <p>Choose your Category:</p>
        <button onClick={() => this.handleCatChoice(9)}>
          General Knowledge
        </button>
        <button onClick={() => this.handleCatChoice(10)}>Books</button>
        <button onClick={() => this.handleCatChoice(11)}>Film</button>
        <button onClick={() => this.handleCatChoice(12)}>Music</button>
        <button onClick={() => this.handleCatChoice(14)}>Television</button>
        <button onClick={() => this.handleCatChoice(15)}>Video Games</button>
        <button onClick={() => this.handleCatChoice(16)}>Board Games</button>
        <button onClick={() => this.handleCatChoice(17)}>Nature</button>
        <button onClick={() => this.handleCatChoice(18)}>Computers</button>
        <button onClick={() => this.handleCatChoice(19)}>Mathematics</button>
        <button onClick={() => this.handleCatChoice(20)}>Mythology</button>
        <button onClick={() => this.handleCatChoice(21)}>Sports</button>
        <button onClick={() => this.handleCatChoice(22)}>Geography</button>
        <button onClick={() => this.handleCatChoice(23)}>History</button>
        <button onClick={() => this.handleCatChoice(24)}>Politics</button>
        <button onClick={() => this.handleCatChoice(27)}>Animals</button>
        <button onClick={() => this.handleCatChoice(28)}>Vehicles</button>
        <button onClick={() => this.handleCatChoice(29)}>Comics</button>
        <button onClick={() => this.handleCatChoice(31)}>Anime</button>
        <button onClick={() => this.handleCatChoice(32)}>Cartoons</button>
      </div>
    );

    const celebration = (
      <div>
        Correct Answer{" "}
        <button onClick={() => this.nextTrivia()}>Next Question</button>
      </div>
    );

    const recuperate = (
      <div>
        Wrong Answer{" "}
        <button onClick={() => this.nextTrivia()}>Next Question</button>
      </div>
    );

    const complete = (
      <div>
        Trivia is Complete{" "}
        <button onClick={() => this.returnHome()}> Try again </button>
      </div>
    );

    return (
      <div>
        {startButton ? triviaStartButton : null}
        {categoryDisplay ? categoryChoices : null}
        {isLoaded && show && !triviaDone ? questionBox : null}
        {isCorrectChoice ? celebration : null}
        {isWrongChoice ? recuperate : null}
        {triviaDone ? complete : null}
      </div>
    );
  }
}

export default App;
