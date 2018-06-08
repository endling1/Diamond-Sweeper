import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Paper from '@material-ui/core/Paper'
import Store from '../data/Store'
import Actions from '../data/Actions'
import { BLANK, QUESTION_MARK, DIAMOND, LEFT_ARROW, RIGHT_ARROW,
	UP_ARROW, DOWN_ARROW } from '../data/constants'
import questionImage from '../img/question.png'
import diamondImage from '../img/diamond.png'

const styles = theme => ({
	square: {
		width: '80%',
		height: '50px',
		backgroundSize: '100% 50px',
		backgroundPosition: 'center',
		backgroundRepeat: 'none',
		margin: '0 auto',
    	padding: '1px',
    	position: 'relative',
	},
	tile: {
		border: '1px solid black',
		cursor: 'pointer',
		margin: '1px'
	}
})

function BoardComponent(props) {
	const { classes, state } = props
	const { board, enableHints } = state.data
	const { squareClicked, toggleHints } = state

	function imageSource(row, column) {
		switch(board[row][column]) {
			case QUESTION_MARK:
				return questionImage
			case DIAMOND:
				return diamondImage
			default:
				return ''
		}
	}

	return (
		<Grid container>
			<Grid item xs={12} lg={6}>
				<GridList cols={9} cellHeight={'auto'} spacing={8}>
					{
						board.map((row, rowIndex) => (
							row.map((square, colIndex) => (
								<GridListTile 
								key={`${rowIndex}:${colIndex}`} 
								cols={1}
								className={classes.tile}
								onClick={squareClicked.bind(null, rowIndex, colIndex)}>
									<div 
									className={classes.square} 
									style={{ backgroundImage: `url(${imageSource(rowIndex, colIndex)})`}}
									/>
								</GridListTile>
							))
						))
					}
				</GridList>
			</Grid>
		</Grid>
	)
}

const BoardView = withStyles(styles)(BoardComponent)

class AppView extends React.Component {
	constructor(props) {
		super(props)
	}

	static getStores() {
		return [
			Store
		]
	}

	static calculateState() {
		return {
			data: Store.getState(),
			squareClicked: Actions.squareClicked,
			toggleHints: Actions.toggleHints
		}
	}

	render() {
		return (
			<BoardView state={this.state}></BoardView>
		)
	}
}

export default AppView