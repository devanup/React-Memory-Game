// import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCog,
	faSun,
	faMoon,
	faVolumeHigh,
	faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';

const Header = () => (
	<header>
		<a href='#' className='logo' id='logo'>
			Match 'Em
		</a>
		<table>
			<tr>
				<td>
					<button className='newgame-btn'>New Game</button>
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

const Grid = () => {
	const cards = [
		'🤪',
		'😎',
		'😭',
		'🤪',
		'🥸',
		'😎',
		'🤠',
		'🤠',
		'🥸',
		'🥶',
		'🥶',
		'😭',
	];

	return (
		<div className='grid'>
			{cards.map((card, index) => (
				<div key={index} className='card'>
					<div className='content'>{card}</div>
				</div>
			))}
		</div>
	);
};

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

const Credit = () => (
	<div className='credit'>
		<p>
			Designed & developed by{' '}
			<span>
				<a href='' target='_blank'>
					Anup
				</a>
			</span>
		</p>
	</div>
);

function App() {
	return (
		<div className='max-width'>
			<Header />
			<Grid />
			<Settings />
			<Credit />
		</div>
	);
}

export default App;
