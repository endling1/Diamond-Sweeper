import { ReduceStore } from 'flux/utils'
import ActionTypes from './ActionTypes'
import Dispatcher from './Dispatcher'
import { BLANK, QUESTION_MARK, DIAMOND, LEFT_ARROW, RIGHT_ARROW,
	UP_ARROW, DOWN_ARROW, MAX } from './constants'
import { shuffleArray, createBoard, computeDistances, 
	replaceDistanceByArrow } from './utils'


class Store extends ReduceStore {
	constructor() {
		super(Dispatcher)
	}

	initializeBoard(size) {
		const diamondRowPos = shuffleArray(size)
		const diamondColumnPos = shuffleArray(size)
		const temp = createBoard(size, MAX)
		const diamondPos = []

		for(let i = 0; i < size; i++) {
			diamondPos.push({
				row: diamondRowPos[i],
				col: diamondColumnPos[i]
			})
			temp[diamondRowPos[i]][diamondColumnPos[i]] = 0
		}

		computeDistances(temp, diamondPos)
		const board = replaceDistanceByArrow(temp)

		return board
	}

	getInitialState() {
		this.meta = {
			board: this.initializeBoard(8),
			prevArrowPosition: {
				row: null,
				column: null
			}
		}

		const emptyBoard = createBoard(8, QUESTION_MARK)

		return {
			board: emptyBoard,
			enableHints: true
		}
	}

	reduce(state, action) {
		switch(action.type) {
			case ActionTypes.SQUARE_CLICKED:
				{
					const { row, column } = action.data
					const nextState = Object.assign({}, state)
					const { board, enableHints } = nextState
					
					// If cell is diamond
					if(this.meta.board[row][column] === DIAMOND) {
						board[row][column] = DIAMOND

						// Change currently displayed arrow to Question mark
						const { row: prevRow, column: prevCol} = this.meta.prevArrowPosition
						if(prevRow != null) {
							board[prevRow][prevCol] = QUESTION_MARK
						}
						
						return nextState
					}

					// If hints disabled, just show blank
					if(!enableHints) {
						board[row][column] = BLANK
						return nextState
					}
					
					// Change currently displayed arrow to Question mark
					const { row: prevRow, column: prevCol} = this.meta.prevArrowPosition
					if(prevRow != null) {
						board[prevRow][prevCol] = QUESTION_MARK
					}

					// Show arrow
					board[row][column] = this.meta.board[row][column]
					
					// Save arrow position
					this.meta.prevArrowPosition = {
						row,
						column
					}

					return nextState
				}
				break

			case ActionTypes.TOGGLE_HINTS:
				const nextState = Object.assign({}, state)
				nextState.enableHints = !nextState.enableHints
				return nextState

			default:
				return state
		}
	}
}

export default new Store()