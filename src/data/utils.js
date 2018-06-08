import { BLANK, QUESTION_MARK, DIAMOND, LEFT_ARROW, RIGHT_ARROW,
	UP_ARROW, DOWN_ARROW, MAX } from './constants'

// Creates an array where array[i] = i
export const createIndexArray = (size) => {
	const array = []
	for(let i = 0; i < size; i++) {
		array.push(i)
	}
	return array
}

// Deep copies 2d array
export const deepCopy2d = (array) => {
	const copy = array.map((row) => [...row])
	return copy
}

// Shuffles array elements 
export const shuffleArray = (size) => {
	const array = createIndexArray(size)
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

// Creates 2d array
export const createBoard = (size, fillElement) => {
	const board = []
	
	for(let i = 0; i < size; i++) {
		board.push((new Array(size)).fill(fillElement))
	}

	return board
}

/*
* Computes distances for each cell in board
* to closest diamond using multipoint BFS
*/
export const computeDistances = (board, diamondPos) => {
	//const board = deepCopy2d(board)
	const size = board.length

	diamondPos.forEach((pos) => {
		const q = []
		q.push(pos)

		while(q.length > 0) {
			const { row, col } = q.shift()
			const dist = board[row][col] + 1

			//left cell
			if((col - 1) >= 0 && dist < board[row][col - 1]) {
				q.push({
					row: row,
					col: (col - 1)
				})
				board[row][col - 1] = dist
			}

			//top cell
			if((row - 1) >= 0 && dist < board[row][col]) {
				q.push({
					row: (row - 1),
					col: (col)
				})
				board[row - 1][col] = dist
			}

			//right cell
			if((col + 1) < size && dist < board[row][col + 1]) {
				q.push({
					row: row,
					col: (col + 1)
				})
				board[row][col + 1] = dist
			}

			//bottom cell
			if((row + 1) < size && dist < board[row + 1][col]) {
				q.push({
					row: (row + 1),
					col: col
				})
				board[row + 1][col] = dist
			}
		}
	})

	return board
}

/*
* Replaces distances by arrows by considering minimum
* distance among 4 neighbouring cells
*/
export const replaceDistanceByArrow = (board) => {
	const arrowBoard = deepCopy2d(board)
	const size = board.length

	function createArrow(row, col) {
		if(board[row][col] == 0) {
			return DIAMOND
		}

		const neighbourDistances = (new Array(4)).fill(MAX)
		//left
		if(col - 1 >= 0) {
			neighbourDistances[0] = board[row][col - 1]
		}
		//top
		if(row - 1 >= 0) {
			neighbourDistances[1] = board[row - 1][col]
		}
		//right
		if(col + 1 < size) {
			neighbourDistances[2] = board[row][col + 1]
		}
		//bottom
		if(row + 1 < size) {
			neighbourDistances[3] = board[row + 1][col]
		}

		//Find minimum cell
		let minDistance = MAX, minIndex
		neighbourDistances.forEach((distance, i) => {
			if(distance < minDistance) {
				minDistance = distance
				minIndex = i
			}
		})

		//Replace by appropriate arrow
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
			arrowBoard[i][j] = createArrow(i, j)
		}
	}
	return arrowBoard
}