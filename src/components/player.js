import React, {Component} from 'react';
import styled from 'styled-components';


const PlayerForm = styled.form`
    max-width:300px;
    margin:10px auto;
    display:flex;
    flex-direction:column;
    text-align: center;
`;

const PlayerLabelContainer = styled.label`
    display:flex;
    flex-direction:row;
    margin:10px;
`;

const PlayerLabel = styled.label`
    max-width:120px;    
    margin:10px auto;
`;

const PlayerX = styled.input`
    background: #5cb4dd;
    width:120px;
    border:0px;
    border-radius:10px;
    padding:20px;
    color:#fff;
    cursor:pointer;
    font-size:2em;
    font-weight:700;
`;

const PlayerO = styled.input`
    background: #abdd5c;
    width:120px;
    border:0px;
    border-radius:10px;
    padding:20px;
    color:#fff;
    cursor:pointer;
    font-size:2em;
    font-weight:700;
`;

class Player extends Component {

    /* Handle choice */
    handlePlayer(e){
        e.preventDefault();
        this.props.player(e.target.value);
    }

    render() {
        return (
            <PlayerForm>
                Choose your player:
                <PlayerLabelContainer>
                    <PlayerLabel>
                        <PlayerX type="submit" name="player" value="X" onClick={(e)=>this.handlePlayer(e)}></PlayerX>
                    </PlayerLabel>
                    <PlayerLabel>
                        <PlayerO type="submit" name="player" value="O" onClick={(e)=>this.handlePlayer(e)}></PlayerO>
                    </PlayerLabel>
                </PlayerLabelContainer>
            </PlayerForm>   

        );
    }
}

export default Player;