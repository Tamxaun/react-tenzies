import React from 'react'
import { FC } from 'react'
import { TenziesProps } from '.'
import { Die } from './Die'
import { nanoid } from 'nanoid'
import Confetti from "react-confetti"
import logo from '../assets/tenzi-logo.svg'
import './Tenzies.css'


export const Tenzies: FC<TenziesProps> = (props) => {
	const [dice, setDice] = React.useState(allNewDice())
	const [tenzies, setTenzies] = React.useState(false)
	const [count, setCount] = React.useState(0)
	const [time, setTime] = React.useState(0)
	const [timerRunning, setTimerRunning] = React.useState(true)
	const [currentBestTime, setCurrentBestTime] = React.useState(Number(localStorage.getItem('bestTime')) || 0)

	React.useEffect(() => {
		const allHeld = dice.every(die => die.isHeld)
		const firstValue = dice[0].value
		const allSameValue = dice.every(die => die.value === firstValue)
		if (allHeld && allSameValue) {
			setTenzies(true)
			setTimerRunning(false)
			saveBestTimeToLocalStorage(time)
		}
	}, [dice])

	React.useEffect(() => {

		let interval: ReturnType<typeof setInterval> | undefined = undefined;

		if (timerRunning) {
			interval = setInterval(() => {
				setTime(oldTime => oldTime + 10)
			}, 10)
		} else if (!timerRunning) {
			clearInterval(interval)
		}

		return () => clearInterval(interval)

	}, [timerRunning])

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid()
		}
	}

	function allNewDice() {
		const newDice = []
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie())
		}
		return newDice
	}

	function rollDice() {
		setCount(oldCount => oldCount + 1);

		if (!tenzies) {
			setDice(oldDice => oldDice.map(die => {
				return die.isHeld ?
					die :
					generateNewDie()
			}))
		} else {
			setTenzies(false)
			setCount(0)
			setTime(0)
			setTimerRunning(true)
			saveBestTimeToLocalStorage(time)
			setDice(allNewDice())
		}
	}

	function holdDice(id: string) {
		setDice(oldDice => oldDice.map(die => {
			return die.id === id ?
				{ ...die, isHeld: !die.isHeld } :
				die
		}))
	}

	function saveBestTimeToLocalStorage(time: number) {
		const bestTime = Number(localStorage.getItem('bestTime')) || 0

		if (bestTime != 0 && time < bestTime) {
			localStorage.setItem('bestTime', String(time))
			setCurrentBestTime(time)
		} else if (bestTime === 0) {
			localStorage.setItem('bestTime', String(time))
			setCurrentBestTime(time)
		}

	}

	const diceElements = dice.map(die => (
		<Die
			key={die.id}
			value={die.value}
			isheld={die.isHeld ? true : undefined}
			onClick={() => holdDice(die.id)}
		/>
	))

	return <div className='container' {...props}>
		<div className='wrap'>
			{tenzies && <Confetti />}
			<img src={logo} className="tenzies-logo" alt="Tenzies logo" />
			<p className='desc'>
				Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
			</p>
			<div className='stats'>
				<div>⏳ {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</div>
				{currentBestTime ? <div>🏆 {("0" + Math.floor((currentBestTime / 60000) % 60)).slice(-2)}:{("0" + Math.floor((currentBestTime / 1000) % 60)).slice(-2)}</div> : undefined}
			</div>
			<div className="dices">
				{diceElements}
			</div>
			<button
				onClick={rollDice}
				className="roll-dice"
				type="button"
			>
				{tenzies ? "New Game" : `Roll — ${count} 🎲`}
			</button>
		</div>
	</div>;
};
