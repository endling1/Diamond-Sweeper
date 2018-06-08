import { ReduceStore } from 'flux/utils'
import ActionTypes from './ActionTypes'
import Dispatcher from './Dispatcher'
import { BLANK, QUESTION_MARK, DIAMOND, LEFT_ARROW, RIGHT_ARROW,
	UP_ARROW, DOWN_ARROW, MAX, APP_NAME } from './constants'
import { shuffleArray, createBoard, computeDistances, 
	replaceDistanceByArrow, deepCopy2d } from './utils'


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
			},
			diamondsFound : 0
		}

		const emptyBoard = createBoard(8, QUESTION_MARK)
		const savedGames = localStorage.getItem(APP_NAME)

		return {
			board: emptyBoard,
			enableHints: true,
			score: 64,
			gameOver: false,
			savedGames: (savedGames === null ? [] : JSON.parse(savedGames))
		}
	}

	reduce(state, action) {
		switch(action.type) {
			case ActionTypes.SQUARE_CLICKED:
			{
				if(this.meta.diamondsFound === 8) {
					return state
				}

				const { row, column } = action.data
				const nextState = Object.assign({}, state)
				const { board, enableHints } = nextState
				
				// If cell is diamond
				if(this.meta.board[row][column] === DIAMOND) {
					board[row][column] = DIAMOND

					// Game over if all diamonds found
					this.meta.diamondsFound += 1
					if(this.meta.diamondsFound === 8) {
						nextState.gameOver = true
					}

					// Change currently displayed arrow to Question mark
					const { row: prevRow, column: prevCol} = this.meta.prevArrowPosition
					if(prevRow != null) {
						board[prevRow][prevCol] = QUESTION_MARK
					}

					return nextState
				}

				// Update score
				nextState.score -= 1

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
			{
				const nextState = Object.assign({}, state)
				nextState.enableHints = !nextState.enableHints
				return nextState
			}
				break

			case ActionTypes.SAVE_GAME:
			{
				const nextState = Object.assign({}, state)
				
				// Copy current game data
				const currentGame = {
					userBoard: deepCopy2d(state.board),
					gameBoard: deepCopy2d(this.meta.board),
					prevArrowPosition: {
						row: this.meta.prevArrowPosition.row,
						column: this.meta.prevArrowPosition.column
					},
					diamondsFound : this.meta.diamondsFound,
					score: state.score,
					gameOver: state.gameOver
				}
				let storageData = [...nextState.savedGames]
				storageData.unshift(currentGame)

				// Limit to most recent 5 games
				storageData = storageData.slice(0, 5)
				nextState.savedGames = storageData

				// Save in local storage
				try {
					localStorage.setItem(APP_NAME, JSON.stringify(storageData))
				} catch(err) {
					console.log(err)
				}
				return nextState
			}
				break

			case ActionTypes.NEW_GAME:
			{
				const nextState = Object.assign({}, state)
				nextState.score = 64
				nextState.board = createBoard(8, QUESTION_MARK)
				nextState.gameOver = false

				// Create new board
				this.meta = {
					board: this.initializeBoard(8),
					prevArrowPosition: {
						row: null,
						column: null
					},
					diamondsFound : 0
				}

				return nextState
			}
				break

			case ActionTypes.LOAD_GAME:
			{
				const nextState = Object.assign({}, state)
				const i = action.gameIndex
				nextState.score = state.savedGames[i].score
				nextState.board = deepCopy2d(state.savedGames[i].userBoard)
				nextState.gameOver = state.savedGames[i].gameOver

				// Create new board
				this.meta = {
					board: deepCopy2d(state.savedGames[i].gameBoard),
					prevArrowPosition: {
						row: state.savedGames[i].prevArrowPosition.row,
						column: state.savedGames[i].prevArrowPosition.column
					},
					diamondsFound : state.savedGames[i].diamondsFound
				}

				return nextState
			}
				break
			default:
				return state
		}
	}
}

export default new Store()