import ActionTypes from './ActionTypes'
import Dispatcher from './Dispatcher'

const Actions = {
	squareClicked(row, column) {
		Dispatcher.dispatch({
			type: ActionTypes.SQUARE_CLICKED,
			data: {
				row: row,
				column: column
			}
		})
	},
	toggleHints() {
		Dispatcher.dispatch({
			type: ActionTypes.TOGGLE_HINTS
		})
	},
	saveGame() {
		Dispatcher.dispatch({
			type: ActionTypes.SAVE_GAME
		})
	},
	newGame() {
		Dispatcher.dispatch({
			type: ActionTypes.NEW_GAME
		})
	},
	loadGame(i) {
		Dispatcher.dispatch({
			type: ActionTypes.LOAD_GAME,
			gameIndex: i
		})
	}
}

export default Actions