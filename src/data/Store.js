import { ReduceStore } from 'flux/utils'
import ActionTypes from './ActionTypes'
import Dispatcher from './Dispatcher'
import { BLANK, QUESTION_MARK, DIAMOND, LEFT_ARROW, RIGHT_ARROW,
	UP_ARROW, DOWN_ARROW } from './constants'

class Store extends ReduceStore {
	constructor() {
		super(Dispatcher)
	}

	getInitialState() {
		function createBoard(size) {
			const board = []
			
			for(let i = 0; i < size; i++) {
				board.push((new Array(size)).fill(QUESTION_MARK))
			}

			return board
		}

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

		function insertDiamonds(board, diamondRowPos, diamondColumnPos) {
			const numberOfDiamonds = diamondRowPos.length

			for(let i = 0; i < numberOfDiamonds; i++) {
				board[diamondRowPos[i]][diamondColumnPos[i]] = DIAMOND
			}

			return board
		}

		this.metaData = insertDiamonds(
			createBoard(8),
			shuffleArray(8),
			shuffleArray(8)
		)

		const emptyBoard = createBoard(8)

		return {
			board: emptyBoard,
			enableHints: false
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

				const arrowType = this.findClosestDiamond(row, column)
				board[row][column] = arrowType
				return nextState

			case ActionTypes.TOGGLE_HINTS:
				state.enableHints = !state.enableHints
				return state

			default:
				return state
		}
	}

	findClosestDiamond(row, column) {
		
	}
}

export default new Store()