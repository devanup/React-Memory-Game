import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCog,
	faSun,
	faMoon,
	faVolumeHigh,
	faVolumeMute,
	faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import clickSound from './assets/card-flip.mp3';
import matchSound from './assets/card-match.mp3';
import winSound from './assets/win-sound.mp3';
import './util.js';

const shuffle = (array) => {
	// Loop through the array from the end to the beginning
	for (let i = array.length - 1; i > 0; i--) {
		// Generate a random index within the remaining unshuffled portion of the array
		const j = Math.floor(Math.random() * (i + 1));
		// Swap the current element with the randomly selected element
		[array[i], array[j]] = [array[j], array[i]];
	}
	// Return the shuffled array
	return array;
};

// NewGameButton component that receives an onClick prop to handle button clicks
const NewGameButton = ({ onClick }) => {
	return (
		<button className='new-game-button' onClick={onClick}>
			New Game
		</button>
	);
};

const Grid = ({ refProp, setMoves, setAllMatched }) => {
	const originalCards = ['🐶', '🐱', '🐻', '🐨', '🦁', '🐯'];
	const [cards, setCards] = useState([]);
	const [flippedCards, setFlippedCards] = useState([]);
	const [matchedCards, setMatchedCards] = useState([]);

	const clickAudio = new Audio(clickSound);
	const matchAudio = new Audio(matchSound);
	const winAudio = new Audio(winSound);

	useEffect(() => {
		const emojiPairs = originalCards.flatMap((emoji) => [emoji, emoji]);
		const shuffledPairs = shuffle(emojiPairs);
		setCards(shuffledPairs);
	}, []);

	const startNewGame = () => {
		setTimeout(() => {
			setFlippedCards([]);
			setMatchedCards([]);
		}, 100);

		setTimeout(() => {
			const emojiPairs = originalCards.flatMap((emoji) => [emoji, emoji]);
			const shuffledPairs = shuffle(emojiPairs);
			setCards(shuffledPairs);
		}, 700);
		setMoves(0); // reset move count
		setAllMatched(false);
	};

	useEffect(() => {
		if (flippedCards.length === 2) {
			const [firstCard, secondCard] = flippedCards;

			if (cards[firstCard] === cards[secondCard]) {
				setMatchedCards((prevMatchedCards) => [
					...prevMatchedCards,
					firstCard,
					secondCard,
				]);
				setTimeout(() => {
					matchAudio.play();
				}, 750);
			}

			setTimeout(() => {
				setFlippedCards([]);
				if (cards[firstCard] === cards[secondCard]) {
					setMoves((prevMoves) => prevMoves + 1);
				}
			}, 700);
		}

		if (matchedCards.length === cards.length && matchedCards.length !== 0) {
			setTimeout(() => {
				setAllMatched(true);
				winAudio.play();
			}, 800);
		}
	}, [flippedCards, cards, setMoves]);

	// Handle card click
	const handleClick = (index) => {
		if (flippedCards.length === 2 || matchedCards.includes(index)) {
			return;
		}
		if (flippedCards.includes(index)) {
			return;
		}
		setFlippedCards((prevFlippedCards) => [...prevFlippedCards, index]);

		clickAudio.play(); // play audio

		if (flippedCards.length === 1 && cards[flippedCards[0]] !== cards[index]) {
			setMoves((prevMoves) => prevMoves + 1);
		}
	};

	// Set up ref to pass startNewGame function to header component
	useEffect(() => {
		refProp.current = {
			startNewGame,
		};
	}, [refProp, startNewGame]);

	// Render grid
	return (
		<>
			<div className='grid'>
				{cards.map((card, index) => (
					// determine the class name of the card based on its current state
					<div
						key={index}
						className={`card ${
							(matchedCards.includes(index) && flippedCards.includes(index)) ||
							matchedCards.includes(index)
								? 'flipped matched'
								: matchedCards.includes(index)
								? 'matched'
								: flippedCards.includes(index)
								? 'flipped'
								: ''
						}`}
						onClick={() => handleClick(index)}
					>
						<div className='content front'>{/* Front content */}</div>
						<div className='content back'>{card}</div>
					</div>
				))}
			</div>
		</>
	);
};

const Header = ({ gridRef, moves }) => {
	// Function to handle click on the New Game button
	const handleClick = () => {
		gridRef.current.startNewGame(); // Calls the startNewGame method of the Grid component
	};

	return (
		<header>
			<a href='#' className='logo' id='logo'>
				Match 'Em
			</a>
			<table>
				<tbody>
					<tr>
						<td>
							<div className='moves'>
								{moves} {moves > 1 ? 'moves' : 'move'}
							</div>
						</td>
						<td>
							<NewGameButton onClick={handleClick} />
						</td>
					</tr>
				</tbody>
			</table>
		</header>
	);
};

const Modal = ({ moves, allMatched }) => {
	// console.log(`${moves} moves`);
	// console.log(`All matched?: ${allMatched}`);
	return (
		<div className={`modal ${allMatched === true ? 'showModal' : ''}`}>
			<span role='img' aria-label='celerbate'>
				🥳
			</span>
			<div className='modal-wrap'>
				<h1>You've matched 'em all!</h1>
				<p>{`${moves} ${moves > 1 ? 'moves' : 'move'}`}</p>
			</div>
		</div>
	);
};

const Credit = () => (
	<div className='credit'>
		<p>
			Designed & developed by{' '}
			<span>
				<a href='https://github.com/devanup/React-Memory-Game' target='_blank'>
					Anup
				</a>
			</span>
		</p>
	</div>
);

const Settings = () => (
	<div className='theme-toggle' id='theme-toggle'>
		<div className='active-bg' id='active-bg'></div>
		<div className='light-icon active' id='light-icon'>
			{/* <i className='fas fa-sun'></i> */}
			<FontAwesomeIcon icon={faSun} className='fas fa-sun' />
		</div>
		<div className='dark-icon' id='dark-icon'>
			{/* <i className='fas fa-moon'></i> */}
			<FontAwesomeIcon icon={faMoon} className='fas fa-moon' />
		</div>
	</div>
);

const SoundButton = () => {
	const [soundEnabled, setSoundEnabled] = useState(true);

	const handleClick = () => {
		setSoundEnabled(!soundEnabled);
		console.log('Sound: ', soundEnabled);
	};

	return (
		<button
			className='sound-button'
			onClick={handleClick}
			style={{
				position: 'fixed',
				bottom: '50px',
				right: '50px',
				backgroundColor: '#333',
				borderRadius: '50%',
				width: '60px',
				height: '60px',
				outline: 'none',
				border: 'none',
				cursor: 'pointer',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<FontAwesomeIcon
				icon={soundEnabled ? faVolumeUp : faVolumeMute}
				style={{ color: '#fff', fontSize: '24px' }}
			/>
		</button>
	);
};

// Main component that renders the game.
function App() {
	const gridRef = useRef(null);
	const [moves, setMoves] = useState(0);
	const [allMatched, setAllMatched] = useState(false);
	// const [soundEnabled, setSoundEnabled] = useState(true);
	// console.log(moves);
	return (
		<div className='App'>
			<div className='game-container'>
				<Header gridRef={gridRef} moves={moves} />
				<Grid
					refProp={gridRef}
					setMoves={setMoves}
					setAllMatched={setAllMatched}
				/>
				<Credit />
				<Settings />
				<Modal moves={moves} allMatched={allMatched} />
				{/* <SoundButton
					soundEnabled={soundEnabled}
					setSoundEnabled={setSoundEnabled}
				/> */}
			</div>
		</div>
	);
}

export default App;
