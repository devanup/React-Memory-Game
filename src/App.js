import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCog,
	faSun,
	faMoon,
	faVolumeHigh,
	faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import './App.css';

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

const Grid = ({ refProp }) => {
	// Set up original cards and three state variables
	const originalCards = ['🐶', '🐱', '🐻', '🐨', '🦁', '🐯'];

	const [cards, setCards] = useState([]);
	const [flippedCards, setFlippedCards] = useState([]);
	const [matchedCards, setMatchedCards] = useState([]);

	// Set up effect to shuffle the cards on mount
	useEffect(() => {
		// Create pairs of each emoji
		const emojiPairs = originalCards.flatMap((emoji) => [emoji, emoji]);

		// Randomly shuffle the emoji pairs
		const shuffledPairs = shuffle(emojiPairs);
		setCards(shuffledPairs);
	}, []);

	const startNewGame = () => {
		// Reset flipped and matched cards after 100ms
		setTimeout(() => {
			setFlippedCards([]);
			setMatchedCards([]);
		}, 100);

		// Shuffle cards again after 700ms
		setTimeout(() => {
			const emojiPairs = originalCards.flatMap((emoji) => [emoji, emoji]);
			const shuffledPairs = shuffle(emojiPairs);
			setCards(shuffledPairs);
		}, 700);
	};

	// Check if two flipped cards match
	useEffect(() => {
		if (flippedCards.length === 2) {
			const [firstCard, secondCard] = flippedCards;

			if (cards[firstCard] === cards[secondCard]) {
				setMatchedCards((prevMatchedCards) => [
					...prevMatchedCards,
					firstCard,
					secondCard,
				]);
			}
			// Reset flipped cards after 700ms
			setTimeout(() => {
				setFlippedCards([]);
			}, 700);
		}
	}, [flippedCards]);

	// Handle card click
	const handleClick = (index) => {
		if (flippedCards.length === 2 || matchedCards.includes(index)) {
			return;
		}
		if (flippedCards.includes(index)) {
			return;
		}
		setFlippedCards((prevFlippedCards) => [...prevFlippedCards, index]);
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

const Header = ({ gridRef }) => {
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
				<tr>
					<td>
						<NewGameButton onClick={handleClick} />
					</td>
					<td rowSpan='2'>
						<div className='moves'>0 moves</div>
						<div className='timer' id='timer'>
							00:00:00
						</div>
					</td>
				</tr>
			</table>
		</header>
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
	<div className='settings menuOff' id='settings'>
		{/* <i className='fa fa-cog' id='settings-icon'></i> */}
		<FontAwesomeIcon icon={faCog} className='fa' id='settings-icon' />

		<div className='theme-toggle-wrap' id='theme-toggle-wrap'>
			<div className='sound-toggle' id='sound-toggle'>
				<div className='sound-icon'>
					{/* <i className='fa-solid fa-volume-high soundOn' id='sound-on-icon'></i>
					<i className='fa-solid fa-volume-xmark' id='sound-off-icon'></i> */}
					<FontAwesomeIcon
						icon={faVolumeHigh}
						className='fa-solid fa-volume-high soundOn'
						id='sound-on-icon'
					/>
					<FontAwesomeIcon
						icon={faVolumeMute}
						className='fa-solid fa-volume-xmark'
						id='sound-off-icon'
					/>
				</div>
			</div>
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
		</div>
	</div>
);

// Main component that renders the game.
function App() {
	// create a reference to the grid component
	const gridRef = useRef(null);

	return (
		<div className='App'>
			<div className='game-container'>
				<Header gridRef={gridRef} />
				<Grid refProp={gridRef} />
				<Credit />
				<Settings />
			</div>
		</div>
	);
}

export default App;
