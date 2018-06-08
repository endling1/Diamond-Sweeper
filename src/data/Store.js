import { ReduceStore } from 'flux/utils'
import ActionTypes from './ActionTypes'
import Dispatcher from './Dispatcher'
import { BLANK, QUESTION_MARK, DIAMOND, LEFT_ARROW, RIGHT_ARROW,
	UP_ARROW, DOWN_ARROW } from './constants'
const MAX = 1000000

function shuffleArray(size) {
	const array = []

	for(let i = 0; i < size; i++) {
		array.push(i)
	}

	let currentIndex = size, temp, randomIndex
	
	while(currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex -= 1

		temp = array[currentIndex]
		array[currentIndex] = array[randomIndex]
		array[randomIndex] = temp
	}

	return array
}

function createEmptyBoard(size, fillWith) {

	const board = []
	
	for(let i = 0; i < size; i++) {
		board.push((new Array(size)).fill(fillWith))
	}

	return board
}

function insertDiamonds(board, diamondRowPos, diamondColumnPos) {
	const numberOfDiamonds = diamondRowPos.length

	for(let i = 0; i < numberOfDiamonds; i++) {
		board[diamondRowPos[i]][diamondColumnPos[i]] = DIAMOND
	}

	return board
}

class Store extends ReduceStore {
	constructor() {
		super(Dispatcher)
	}

	createBoard(size) {
		const diamondRowPos = shuffleArray(size)
		const diamondColumnPos = shuffleArray(size)
		const board = createEmptyBoard(size, MAX)

		const diamondPos = []

		for(let i = 0; i < size; i++) {
			diamondPos.push({
				row: diamondRowPos[i],
				col: diamondColumnPos[i]
			})
			board[diamondRowPos[i]][diamondColumnPos[i]] = 0
		}

		// Compute distances to closest diamonds
		diamondPos.forEach((pos) => {
			const q = []
			q.push(pos)

			while(q.length > 0) {
				const { row, col } = q.shift()
				const dist = board[row][col] + 1

				//left
				if((col - 1) >= 0 && dist < board[row][col - 1]) {
					q.push({
						row: row,
						col: (col - 1)
					})
					board[row][col - 1] = dist
				}

				//top
				if((row - 1) >= 0 && dist < board[row][col]) {
					q.push({
						row: (row - 1),
						col: (col)
					})
					board[row - 1][col] = dist
				}

				//right
				if((col + 1) < size && dist < board[row][col + 1]) {
					q.push({
						row: row,
						col: (col + 1)
					})
					board[row][col + 1] = dist
				}

				//bottom
				if((row + 1) < size && dist < board[row + 1][col]) {
					q.push({
						row: (row + 1),
						col: col
					})
					board[row + 1][col] = dist
				}
			}
		})

		function findArrowDirection(row, col) {
			if(board[row][col] == 0) {
				return DIAMOND
			}
			const neighbourDistance = [];

			(col - 1) >= 0 ? neighbourDistance.push(board[row][col - 1]) : neighbourDistance.push(MAX);
			(row - 1) >= 0 ? neighbourDistance.push(board[row - 1][col]) : neighbourDistance.push(MAX);
			(col + 1) < size ? neighbourDistance.push(board[row][col + 1]) : neighbourDistance.push(MAX);
			(row + 1) < size ? neighbourDistance.push(board[row + 1][col]) : neighbourDistance.push(MAX);
			
			let minDistance = 10000, minIndex
			neighbourDistance.forEach((distance, i) => {
				if(distance < minDistance) {
					minDistance = distance
					minIndex = i
				}
			})

			switch(minIndex) {
				case 0:
					return LEFT_ARROW
				case 1:
					return UP_ARROW
				case 2:
					return RIGHT_ARROW
				case 3:
					return DOWN_ARROW
				default:
					return QUESTION_MARK
			}
		}
		for(let i = 0; i < size; i++) {
			for(let j = 0; j < size; j++) {
				board[i][j] = findArrowDirection(i, j)
			}
		}


		return board
	}

	getInitialState() {
		this.metaData = this.createBoard(8)
		this.lastClickedPos = {
			row: -1,
			col: -1
		}

		const emptyBoard = createEmptyBoard(8, QUESTION_MARK)

		return {
			board: emptyBoard,
			enableHints: true
		}
	}

	reduce(state, action) {
		switch(action.type) {
			case ActionTypes.SQUARE_CLICKED: 
				const { row, column } = action.data
				const nextState = Object.assign({}, state)
				const { board, enableHints } = nextState
				
				if(this.metaData[row][column] === DIAMOND) {
					board[row][column] = DIAMOND
					return nextState
				}
				if(!enableHints) {
					board[row][column] = BLANK
					return nextState
				}
				
				const prevRow = this.lastClickedPos.row
				const prevCol = this.lastClickedPos.col
				if(prevRow >= 0 && prevCol >= 0) {
					board[prevRow][prevCol] = QUESTION_MARK
				}
				board[row][column] = this.metaData[row][column]
				this.lastClickedPos = {
					row: row,
					col: column
				}

				return nextState

			case ActionTypes.TOGGLE_HINTS:
				state.enableHints = !state.enableHints
				return state

			default:
				return state
		}
	}
}

export default new Store()