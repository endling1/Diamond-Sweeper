import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Paper from '@material-ui/core/Paper'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import SaveIcon from '@material-ui/icons/Save'
import RefreshIcon from '@material-ui/icons/Refresh'
import HintIcon from '@material-ui/icons/WbIncandescent'
import Store from '../data/Store'
import Actions from '../data/Actions'
import { BLANK, QUESTION_MARK, DIAMOND, LEFT_ARROW, RIGHT_ARROW,
	UP_ARROW, DOWN_ARROW } from '../data/constants'
import questionImage from '../img/question.png'
import diamondImage from '../img/diamond.png'
import leftArrow from '../img/leftArrow.png'
import rightArrow from '../img/rightArrow.png'
import upArrow from '../img/upArrow.png'
import downArrow from '../img/downArrow.png'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

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
	},
	bottom: {
		marginTop: '16px',
		width: '80%'
	},
	cardList: {
		overflowY: 'scroll',
		height: '50vh',
		border: '1px solid black',
	},
	card: {
		border: '1px solid gray',
		margin: '4px'
	}
})

function BoardComponent(props) {
	const { classes, state } = props
	const { board, enableHints, score, gameOver, savedGames } = state.data
	const { squareClicked, toggleHints, saveGame, newGame, loadGame } = state

	function imageSource(row, column) {
		switch(board[row][column]) {
			case QUESTION_MARK:
				return questionImage
			case DIAMOND:
				return diamondImage
			case LEFT_ARROW:
				return leftArrow
			case RIGHT_ARROW:
				return rightArrow
			case DOWN_ARROW:
				return downArrow
			case UP_ARROW:
				return upArrow
			default:
				return ''
		}
	}

	function bottomNavigationClick(event, value) {
		switch(value) {
			case 0:
				saveGame()
				break
			case 1:
				newGame()
				break
			case 2:
				toggleHints()
				break
			default:
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

			<Grid item xs={12} lg={6}>
				<div>
					<h1> Score: {score} </h1>
					{
						gameOver ? (
							<h1> Game Over! All diamonds found! </h1>
						) : (
							null
						)
					}
				</div>
				<h3> Last 5 Saved Games </h3>
				<div className={classes.cardList}>
					{
						savedGames.map((game, i) => (
							<Card key={i} className={classes.card}>
								<CardContent>
									<h3> Game Number : {i} </h3>
									<h3> Score : {game.score} </h3>
									<h3> Diamonds found : {game.diamondsFound}</h3>
								</CardContent>
								<CardActions>
									<Button 
									size={'small'}
									onClick={loadGame.bind(null, i)}
									> Load Game </Button>
								</CardActions>
							</Card>
						))
					}
				</div>
			</Grid>

			<Grid item xs={12} lg={6}>
				<BottomNavigation
				value={enableHints ? 2 : -1}
				className={classes.bottom} 
				showLabels
				onChange={bottomNavigationClick}>
					<BottomNavigationAction label='Save' icon={<SaveIcon />} />
					<BottomNavigationAction label='New' icon={<RefreshIcon/>} />
					<BottomNavigationAction label='Hint' icon={<HintIcon/>} />
				</BottomNavigation>
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
			toggleHints: Actions.toggleHints,
			saveGame: Actions.saveGame,
			newGame: Actions.newGame,
			loadGame: Actions.loadGame
		}
	}

	render() {
		return (
			<BoardView state={this.state}></BoardView>
		)
	}
}

export default AppView