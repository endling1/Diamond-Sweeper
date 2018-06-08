import * as U from '../src/data/utils'
import { assert } from 'chai'
import { initialBoard, diamondPositions, distanceBoard, 
	arrowBoard} from './data'

describe('Tests src/data/utils.js', () => {
	it('Tests createIndexArray', () => {
		// Positive test
		let a = [0, 1, 2, 3]
		let e = U.createIndexArray(4)
		assert.deepEqual(a, e)

		// Boundary test
		a = []
		e = U.createIndexArray()
		assert.deepEqual(a, e)

		// Negative test
		a = [1, 2, 3]
		e = U.createIndexArray(3)
		assert.notDeepEqual(a, e)
	})

	it('Tests deepCopy2d', () => {
		let a = [[1, 2, 3], [4, 5, 6]]
		let e = U.deepCopy2d(a)
		assert.deepEqual(a, e)

		a = [[]]
		e = U.deepCopy2d(a)
		assert.deepEqual(a, e)
	})

	// May fail but low probability
	it('Tests shuffleArray', () => {
		let a = [0, 1, 2, 3, 4, 5]
		let e = U.shuffleArray(6)
		assert.notDeepEqual(a, e)

		a = []
		e = U.shuffleArray(0)
		assert.deepEqual(a, e)
	})

	it('Tests createBoard', () => {
		let a = [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
		let e = U.createBoard(3, 1)
		assert.deepEqual(a, e)
	})

	it('Tests computeDistances', () => {
		let a = distanceBoard
		let e = U.computeDistances(initialBoard, diamondPositions)
		assert.deepEqual(a, e)
	})

	it('Tests replaceDistanceByArrow', () => {
		let a = arrowBoard
		let e = U.replaceDistanceByArrow(U.computeDistances(initialBoard, diamondPositions))
		assert.deepEqual(a, e)
	})
})
