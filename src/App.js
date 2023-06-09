import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faSun,
	faMoon,
	faVolumeMute,
	faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import clickSound from './assets/card-flip.mp3';
import matchSound from './assets/card-match.mp3';
import winSound from './assets/win-sound.mp3';
import './util.js';

/* The shuffle function shuffles the elements of an array in place and returns the shuffled array. The function takes an array as input.*/
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
/* Grid represents the game board of the game. The game consists of a grid of cards, each with an emoji on its back, and the objective is to match pairs of cards with the same emoji */
const Grid = ({ refProp, setMoves, setAllMatched }) => {
	// Define the list of original cards
	const originalCards = ['🐶', '🐱', '🐻', '🐨', '🦁', '🐯'];

	// Define state variables for the shuffled cards, flipped cards, and matched cards
	const [cards, setCards] = useState([]);
	const [flippedCards, setFlippedCards] = useState([]);
	const [matchedCards, setMatchedCards] = useState([]);

	// Define audio files for sound effects
	const clickAudio = new Audio(clickSound);
	const matchAudio = new Audio(matchSound);
	const winAudio = new Audio(winSound);

	// Shuffle the original cards and set the shuffled cards as the initial state of the component
	useEffect(() => {
		const emojiPairs = originalCards.flatMap((emoji) => [emoji, emoji]);
		const shuffledPairs = shuffle(emojiPairs);
		setCards(shuffledPairs);
	}, []);

	// Define a function to start a new game
	const startNewGame = () => {
		setTimeout(() => {
			setFlippedCards([]);
			setMatchedCards([]);
		}, 100);

		// Shuffle the cards again after a longer delay
		setTimeout(() => {
			const emojiPairs = originalCards.flatMap((emoji) => [emoji, emoji]);
			const shuffledPairs = shuffle(emojiPairs);
			setCards(shuffledPairs);
		}, 700);

		// Reset the move count and set the "all matched" state to false
		setMoves(0);
		setAllMatched(false);
	};

	// Check if two cards have been flipped and if they match
	useEffect(() => {
		if (flippedCards.length === 2) {
			const [firstCard, secondCard] = flippedCards;

			if (cards[firstCard] === cards[secondCard]) {
				// Add the matched cards to the matched cards list
				setMatchedCards((prevMatchedCards) => [
					...prevMatchedCards,
					firstCard,
					secondCard,
				]);

				// Play a sound effect for a match after a short delay
				setTimeout(() => {
					matchAudio.play();
				}, 750);
			}

			// Reset the flipped cards after a short delay, and increment the move count if the cards match
			setTimeout(() => {
				setFlippedCards([]);
				if (cards[firstCard] === cards[secondCard]) {
					setMoves((prevMoves) => prevMoves + 1);
				}
			}, 700);
		}

		// If all cards have been matched, set the "all matched" state to true and play a sound effect
		if (matchedCards.length === cards.length && matchedCards.length !== 0) {
			setTimeout(() => {
				setAllMatched(true);
				winAudio.play();
			}, 800);
		}
	}, [flippedCards, cards, setMoves]);

	// Handle card click
	const handleClick = (index) => {
		// If two cards have already been flipped or the card is already matched, do nothing
		if (flippedCards.length === 2 || matchedCards.includes(index)) {
			return;
		}
		// If the card is already flipped, do nothing
		if (flippedCards.includes(index)) {
			return;
		}

		// Add the card to the flipped cards list and play a sound effect
		setFlippedCards((prevFlippedCards) => [...prevFlippedCards, index]);

		clickAudio.play(); // play audio

		// If one card is already flipped and the clicked card does not match, increment the move count
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
							// If the card is both matched and flipped, or just matched, apply the "flipped matched" class
							(matchedCards.includes(index) && flippedCards.includes(index)) ||
							matchedCards.includes(index)
								? 'flipped matched'
								: // If the card is only flipped, apply the "flipped" class
								matchedCards.includes(index)
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

/* The Header component displays the game title, the current number of moves, and a "New Game" button. The gridRef and moves props are passed in from the parent component.*/
const Header = ({ gridRef, moves }) => {
	// Function to handle click on the New Game button
	const handleClick = () => {
		gridRef.current.startNewGame(); // Calls the startNewGame method of the Grid component
	};

	return (
		<header>
			<a href='/' className='logo' id='logo'>
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

/* The Modal component displays a modal dialog when the game is completed, i.e., when all the cards are matched. The moves and allMatched props are passed in from the parent component. */
const Modal = ({ moves, allMatched, gridRef }) => {
	// Function to handle click on the New Game button
	const handleClick = () => {
		gridRef.current.startNewGame(); // Calls the startNewGame method of the Grid component
	};
	// console.log(`${moves} moves`);
	// console.log(`All matched?: ${allMatched}`);

	// The modal is displayed if all the cards are matched (allMatched is true)
	return (
		<>
			<div className={`modal ${allMatched === true ? 'showModal' : ''}`}>
				<span role='img' aria-label='celerbate'>
					🥳
				</span>
				<div className='modal-wrap'>
					<h1>You've matched 'em all!</h1>
					<p>{`${moves} ${moves > 1 ? 'moves' : 'move'}`}</p>
					<NewGameButton onClick={handleClick} />
				</div>
			</div>
		</>
	);
};

/* The Credit component displays the credit, with a link to the GitHub repository.*/
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

/* The Settings component allows the user to switch between light and dark mode. It adds an event listener to the theme toggle button to enable dark mode. */
const Settings = () => {
	// Adds an event listener to the theme toggle button to enable dark mode
	useEffect(() => {
		// Get references to DOM elements
		const lightIcon = document.getElementById('light-icon');
		const darkIcon = document.getElementById('dark-icon');
		const themeToggle = document.getElementById('theme-toggle');
		const activeBg = document.getElementById('active-bg');

		// Function to toggle between light and dark mode
		function toggleDarkMode() {
			// If light mode is active, switch to dark mode
			if (lightIcon.classList.contains('active')) {
				activeBg.style.marginLeft = '50px';
				lightIcon.style.color = '#cbcbcb';
				darkIcon.style.color = '#000';
				document.querySelector('body').classList.add('dark-active');
			} else {
				// If dark mode is active, switch to light mode
				activeBg.style.marginLeft = '0px';
				lightIcon.style.color = '#cbcbcb';
				darkIcon.style.color = '#000';
				document.querySelector('body').classList.remove('dark-active');
			}
			lightIcon.classList.toggle('active');
		}

		// Add event listener for the click event on the theme toggle button
		themeToggle.addEventListener('click', toggleDarkMode);
		// Remove the event listener when the component is unmounted
		return () => {
			themeToggle.removeEventListener('click', toggleDarkMode);
		};
	}, []);

	// Renders a toggle switch for light/dark mode
	return (
		<div className='theme-toggle' id='theme-toggle'>
			<div className='active-bg' id='active-bg'></div>
			<div className='light-icon active' id='light-icon'>
				<FontAwesomeIcon icon={faSun} className='fas fa-sun' />
			</div>
			<div className='dark-icon' id='dark-icon'>
				<FontAwesomeIcon icon={faMoon} className='fas fa-moon' />
			</div>
		</div>
	);
};

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
				<Modal moves={moves} allMatched={allMatched} gridRef={gridRef} />
				{/* <SoundButton
					soundEnabled={soundEnabled}
					setSoundEnabled={setSoundEnabled}
				/> */}
			</div>
		</div>
	);
}

export default App;
