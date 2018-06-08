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
	}
}

export default Actions