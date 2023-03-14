import { PIECES, createBoard } from "./set_up.js"

const board = createBoard()
const boardElement = document.querySelector('.board')
const WHITE = true
const BLACK = false
let turn = WHITE

board.forEach(row => {
    row.forEach(tile => {
        if (turn === tile.piece.white && tile.piece.name !== PIECES.EMPTY) {
            tile.element.style.cursor = 'pointer'
        }
        else {
            tile.element.style.cursor = 'default'
        }
        tile.element.addEventListener('click', () => {
            if (turn === tile.piece.white && tile.piece.name !== PIECES.EMPTY) {
                console.log('sup')
            }
        })
        boardElement.append(tile.element)
    })
})