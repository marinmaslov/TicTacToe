import React, {Component} from 'react';
import logo from './logo.svg';
import Drawing from './tic-tac-toe-drawn.svg';
import './App.css';
import styled from 'styled-components';
import Player from './components/player';
import { runInThisContext } from 'vm';

/* Board dimensions and winning combinations */
const N = 3;
const winning = [["0","1","2"],["3","4","5"],["6","7","8"],["0","3","6"],["1","4","7"],["2","5","8"],["0","4","8"],["2","4","6"]];

/* Game fields */
const Field = styled.div`
  flex: 1 1 auto;
  width: 33.3%;
  transition: all 0.3s ease-in-out 0s;
`;

const FieldInner = styled.div`
  height: 90px;
  width: 90px;
  margin: 5px;
  text-align: center;
  font-size: 3em;
  line-height: 90px;
  font-family: 'Rubik',sans-serif;
  color: #000;
  border-radius: 5px;
`;

/* Winner display */
const WinnerAnnouncement = styled.div`
  max-width:300px;    
  margin: 10px auto;
  text-align:center;
`;

const WinnerCountInner = styled.div`
  max-width:300px;    
  margin:10px auto;
  text-align:center;
  display:flex;
  flex-direction:row;
`;

const WinnerCountText = styled.div`
  max-width: 100px;
  margin: 10px auto;
  text-align: center;
`;

/* Reload button */
const ReloadButton = styled.button`
  background: #dd685c;
  width:200px;
  border:0px;
  border-radius:10px;
  padding:20px;
  color:#fff;
  cursor:pointer;
  font-size:1em;
  font-weight:700;
`;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameContainer: Array(N*N).fill(null),
      background: Array(N*N).fill("#fff"),
      cursor: Array(N*N).fill("pointer"),
      colorX: "#5cb4dd",
      colorO: "#abdd5c",
      player: null,
      winner: null,
      opacity: Array(N*N).fill("1.0"),
      winsX: 0,
      winsO: 0,
      total: 0
    }
  }

  /* If reload set initial values */
  handleReload(){
    this.setState({
      gameContainer: Array(N*N).fill(null),
      background: Array(N*N).fill("#fff"),
      cursor: Array(N*N).fill("pointer"),
      colorX: "#5cb4dd",
      colorO: "#abdd5c",
      player: null,
      winner: null,
      opacity: Array(N*N).fill("1.0")
    })
  }

  /* Checking winner */
  checkIfWinner(){
    if(this.state.winner){
      if(this.state.winner === "X"){ 
        return "The winner is Player X";
      }
      else if(this.state.winner === "O"){
        return "The winner is Player O";
      }
      else {
        return "No winner";
      } 
    }
  }

/* Checking if uneven */
checkIfUneven(){
    let unevenStatus = true;
    for(let i = 0; i<N*N; i++){
      if(!this.state.gameContainer[i]){
        unevenStatus = false;
      }
    }
    if(unevenStatus){
      let newTotal = this.state.total;
      newTotal++;
      this.setState ({
        winner: "uneven",
        total: newTotal
      })
    }
}

  /* Checking if winning event */
  checkGame() {
    let newWinner = this.state.winner;
    for(let i = 0; i < winning.length; i++){
      const [x,y,z] = winning[i];
      
      let newWinsX = this.state.winsX;
      let newWinsO = this.state.winsO;
      let newTotal = this.state.total;

      if(this.state.gameContainer[x] && this.state.gameContainer[x] === this.state.gameContainer[y] && this.state.gameContainer[x] === this.state.gameContainer[z]){
        newWinner = this.state.player;

        newTotal++;
        
        if(this.state.player === "X")
          newWinsX++;
        else
          newWinsO++;
      

        let newOpacity = this.state.opacity;

        for(let i=0; i < N*N; i++){
          let newCursor = this.state.cursor;
          

          newCursor[i] = "default";
          newOpacity[i] = "0.5";
        
          this.setState ({
            cursor: newCursor,
            opacity: newOpacity
          })
        }

        newOpacity[x] = "1.0";
        newOpacity[y] = "1.0";
        newOpacity[z] = "1.0";

        

        this.setState ({
          winner: newWinner,
          total: newTotal,
          winsX: newWinsX,
          winsO: newWinsO
        })
      }
    }
    /* If all fields are clicked, check if uneven */
    if(!newWinner){
      this.checkIfUneven();
    }
  }

  /* Handleing events on GameBox */
  handleClick(index) {
    if(this.state.player && !this.state.winner){    
      let newGameContainer = this.state.gameContainer;
      let newBackground = this.state.background;
      let newCursor = this.state.cursor;
      let nextPlayer = this.state.player;

      if(this.state.gameContainer[index] === null){
        newGameContainer[index] = this.state.player;
        newCursor[index] = "default";
        
        nextPlayer = this.state.player === "X" ? "O" : "X";
        if (this.state.player === "X"){
          newBackground[index] = this.state.colorX;
        }
        else{
          newBackground[index] = this.state.colorO;
        }
        this.setState({
          gameContainer: newGameContainer,
          background: newBackground,
          player: nextPlayer,
        })
        this.checkGame();
      }
    }
  }

  /* Setting player */
  setPlayer(newPlayer){
    this.setState({
      player: newPlayer
    })
  }

  render() {
    /* Game Fields */
    const Fields = this.state.gameContainer.map((fieldValue, index) => 
      <Field key={index}>
        <FieldInner onClick={() => this.handleClick(index)} style={{background: this.state.background[index], cursor: this.state.cursor[index], opacity: this.state.opacity[index]}}>{fieldValue}</FieldInner>
      </Field>
    );

    /* Plazer menu */
    let playerMenu = this.state.player ? "":<Player player={(e) => this.setPlayer(e)}/>;

    /* GameBox */
    let gameBox = this.state.player ? <div className="gameContainer">{Fields}</div>:"";

    /* Checking if there is a winner */
    let Results = this.checkIfWinner();
    
    /* Winner Message */
    let winnerMessage = this.state.winner ? <WinnerAnnouncement className="winnerMessage"><h2>{Results}</h2><ReloadButton onClick={() => this.handleReload()}>Play Again</ReloadButton></WinnerAnnouncement>:"";

    /* Result Message */
    let resultMessage = <WinnerAnnouncement className="winnerMessage"><h3>Total games: {this.state.total}</h3><WinnerCountInner><WinnerCountText>X: {this.state.winsX}</WinnerCountText><WinnerCountText>O: {this.state.winsO}</WinnerCountText></WinnerCountInner></WinnerAnnouncement>;

    return (
      <div className="main-container">
          <div className="logo">
            <img src={Drawing} alt="Tic Tac Toe"/>
            <h1>Tic Tac Toe</h1>
          </div>
          
          {/* Rendering game parts */}
          {playerMenu}
          {gameBox}
          {winnerMessage}
          {resultMessage}
          
        </div>
    );


  }
}

export default App;