import { useState, useEffect } from 'react';
import Board from './Board';
import GameOver from './GameOver';
import GameState from './GameState';
import Reset from './Reset';
import gameOverSoundAsset from '../sounds/win.wav';
import playerXClickSoundAsset from '../sounds/theToll.wav';
import playerOClickSoundAsset from '../sounds/angels.wav';
import resetSoundAsset from '../sounds/danceOrDie.wav';
import titleImgAsset from '../img/abracadabraTitle.png';

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const playerXClickSound = new Audio(playerXClickSoundAsset);
playerXClickSound.volume = 0.2;
const playerOClickSound = new Audio(playerOClickSoundAsset);
playerOClickSound.volume = 0.2;
const resetSound = new Audio(resetSoundAsset);
resetSound.volume = 0.2;

const PLAYER_X = 'X';
const PLAYER_O = 'O';

export const PLAYER_IMAGES = {
	[PLAYER_X]: '/img/red.png',
	[PLAYER_O]: '/img/white2.png',
};

const winningCombinations = [
	//Rows
	{ combo: [0, 1, 2], strikeClass: 'strike-row-1' },
	{ combo: [3, 4, 5], strikeClass: 'strike-row-2' },
	{ combo: [6, 7, 8], strikeClass: 'strike-row-3' },

	//Columns
	{ combo: [0, 3, 6], strikeClass: 'strike-column-1' },
	{ combo: [1, 4, 7], strikeClass: 'strike-column-2' },
	{ combo: [2, 5, 8], strikeClass: 'strike-column-3' },

	//Diag
	{ combo: [0, 4, 8], strikeClass: 'strike-diagonal-1' },
	{ combo: [2, 4, 6], strikeClass: 'strike-diagonal-2' },
];

function checkWinner(tiles, setStrikeClass, setGameState) {
	//console.log('check-winner');
	for (const { combo, strikeClass } of winningCombinations) {
		const tileValue1 = tiles[combo[0]];
		const tileValue2 = tiles[combo[1]];
		const tileValue3 = tiles[combo[2]];

		if (
			tileValue1 != null &&
			tileValue1 === tileValue2 &&
			tileValue1 === tileValue3
		) {
			setStrikeClass(strikeClass);
			if (tileValue1 === PLAYER_X) {
				setGameState(GameState.playerXWins);
			} else {
				setGameState(GameState.playerOWins);
			}
			return;
		}
	}

	const areAllTilesFilledIn = tiles.every((tile) => tile != null);
	if (areAllTilesFilledIn) {
		setGameState(GameState.draw);
	}
}

function TicTacToe() {
	const [tiles, setTiles] = useState(Array(9).fill(null));
	const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
	const [strikeClass, setStrikeClass] = useState();
	const [gameState, setGameState] = useState(GameState.inProgress);

	const handleTileClick = (index) => {
		//console.log(index);
		if (gameState !== GameState.inProgress) {
			return;
		}
		if (tiles[index] !== null) {
			return;
		}
		const newTiles = [...tiles];
		newTiles[index] = playerTurn;
		setTiles(newTiles);
		if (playerTurn === PLAYER_X) {
			playerXClickSound.play();
			setPlayerTurn(PLAYER_O);
		} else {
			playerOClickSound.play();
			setPlayerTurn(PLAYER_X);
		}
	};

	const handleReset = () => {
		//console.log("reset");
		resetSound.play();
		setGameState(GameState.inProgress);
		setTiles(Array(9).fill(null));
		setPlayerTurn(PLAYER_X);
		setStrikeClass(null);
	};

	useEffect(() => {
		const playResetSound = () => {
			resetSound.play();
			document.removeEventListener('click', playResetSound);
		};

		document.addEventListener('click', playResetSound);

		return () => {
			document.removeEventListener('click', playResetSound);
		};
	}, []);

	useEffect(() => {
		checkWinner(tiles, setStrikeClass, setGameState);
	}, [tiles]);

	useEffect(() => {
		if (tiles.some((tile) => tile !== null)) {
			//clickSound.play();
		}
	}, [tiles]);

	useEffect(() => {
		if (
			gameState === GameState.playerXWins ||
			gameState === GameState.playerOWins ||
			gameState === GameState.draw
		) {
			gameOverSound.play();
		}
	}, [gameState]);

	return (
		<div className='game-container'>
			<div className='background-container'>
				<img
					className='title-image'
					src={titleImgAsset}
					alt=''
				/>
				<div className='board-container'>
					<Board
						playerTurn={playerTurn}
						tiles={tiles}
						onTileClick={handleTileClick}
						strikeClass={strikeClass}
					/>
					<GameOver gameState={gameState} />
					<Reset
						gameState={gameState}
						onReset={handleReset}
					/>
				</div>
			</div>
		</div>
	);
}

export default TicTacToe;
