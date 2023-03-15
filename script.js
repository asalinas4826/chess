import { addPieceToElement, PIECES, createBoard } from "./set_up.js"
import { validMoves } from "./chess.js"

const board = createBoard()
const boardElement = document.querySelector('.board')
const turnTextElement = document.querySelector('.turn')
const WHITE = true
const BLACK = false
let turn = WHITE
let selectedTile    // last selected tile
let moves = []

board.forEach(row => {
    row.forEach(tile => {
        if (turn === tile.piece.white && tile.piece.name !== PIECES.EMPTY) {
            tile.element.style.cursor = 'pointer'
        }
        else {
            tile.element.style.cursor = 'default'
        }
        tile.element.addEventListener('click', () => {
            // console.log("white's turn? ", turn)
            if (turn === tile.piece.white && tile.piece.name !== PIECES.EMPTY) { // click own piece, call selectPiece()
                // console.log('selected piece: ', tile.x, tile.y)
                selectPiece(tile)
                moves = validMoves(tile, selectedTile, board)
            }
            else if (selectedTile !== null && selectedTile !== undefined) { // anywhere else, attempt to move
                // console.log('tried to move to: ', tile.x, tile.y)
                if (moves.some(move => { return move.x === tile.x && move.y === tile.y })) { // if tile is in the set of valid moves
                    movePiece(tile)
                    changeTurns()
                }
            }
        })
        boardElement.append(tile.element)
    })
})

function changeTurns() {
    turn = !turn
    if (turn) {
        turnTextElement.innerText = "White's move."
    }
    else {
        turnTextElement.innerText = "Black's move."
    }
    board.forEach(row => {
        row.forEach(tile => {
            if (turn === tile.piece.white && tile.piece.name !== PIECES.EMPTY) {
                tile.element.style.cursor = 'pointer'
            }
            else {
                tile.element.style.cursor = 'default'
            }
        })
    })
    selectedTile = null
}

function selectPiece(tile) {
    if (selectedTile !== null && selectedTile !== undefined) {
        selectedTile.element.style.border = ''
    }
    selectedTile = tile
    tile.element.style.border = '5px solid black'
}

function movePiece(tile) {
    if (tile.piece.name !== PIECES.EMPTY) { // empty the piece you're moving to
        tile.element.removeChild(tile.element.firstChild)
    }
    tile.piece = {...selectedTile.piece}    // replace the piece to desired tile
    
    addPieceToElement(tile.y, tile.x, tile.piece, board)

    selectedTile.element.style.border = ''  // remove piece from previous tile
    selectedTile.element.removeChild(selectedTile.element.firstChild)
    selectedTile.piece = {
        name: PIECES.EMPTY,
        image: '',
        white: true
    }
    selectedTile = null
}