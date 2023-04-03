import { addPieceToElement, PIECES, createBoard } from "./set_up.js"
import { validMoves, inCheck, findKing } from "./chess.js"

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
                moves = validMoves(tile, board)
            }
            else if (selectedTile !== null && selectedTile !== undefined) { // anywhere else, attempt to move
                // console.log('tried to move to: ', tile.x, tile.y)
                if (moves.some(move => { return move.x === tile.x && move.y === tile.y })) { // if tile is in the set of valid moves
                    movePiece(tile, selectedTile)
                    changeTurns()
                }
            }
        })
        boardElement.append(tile.element)
    })
})

function changeTurns() {
    turn = !turn

    const pos = findKing(board, turn)
    if (inCheck(pos.x, pos.y, board, turn)) {
        turnTextElement.innerText = "Check!"
    }
    else {
        turnTextElement.innerText = ""
    }

    if (turn) {
        turnTextElement.innerText += " White's move."
    }
    else {
        turnTextElement.innerText += " Black's move."
    }
    board.forEach(row => {
        row.forEach(tile => {
            if (turn === tile.piece.white) {
                if (tile.piece.name !== PIECES.EMPTY) {
                    tile.element.style.cursor = 'pointer'
                }
                else {
                    tile.element.style.cursor = 'default'
                }
                if (tile.piece.enPassantable) {
                    tile.piece.enPassantable = false
                }
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

function movePiece(toTile, fromTile) {
    if (fromTile.piece.name === PIECES.KING && Math.abs(toTile.x - fromTile.x) === 2) { // king castled, need to move rook
        if (toTile.x > fromTile.x) { // castling king-side
            movePiece(board[fromTile.y][fromTile.x + 1], board[fromTile.y][7])
        }
        else { // castling queen-side
            movePiece(board[fromTile.y][fromTile.x - 1], board[fromTile.y][0])
        }
    }
    else if (fromTile.piece.name === PIECES.PAWN) { // pawn stuff: en passant, double movement
        if (toTile.x !== fromTile.x && toTile.piece.name === PIECES.EMPTY) { // for en passant
            const capturedPiece = board[fromTile.y][toTile.x]
            capturedPiece.element.removeChild(capturedPiece.element.firstChild)
            capturedPiece.piece = {
                name: PIECES.EMPTY,
                image: '',
                white: true,
                hasMoved: false,
                enPassantable: false
            }
        }
        if (Math.abs(toTile.y - fromTile.y) === 2) { // when it's moved twice, it can be en passanted
            fromTile.piece.enPassantable = true
        }
    }

    if (toTile.piece.name !== PIECES.EMPTY) { // empty the piece you're moving to
        toTile.element.removeChild(toTile.element.firstChild)
    }
    toTile.piece = {...fromTile.piece}    // replace the piece to desired tile
    toTile.piece.hasMoved = true
    
    addPieceToElement(toTile.y, toTile.x, toTile.piece, board)

    fromTile.element.style.border = ''  // remove piece from previous tile
    fromTile.element.removeChild(fromTile.element.firstChild)
    fromTile.piece = {
        name: PIECES.EMPTY,
        image: '',
        white: true,
        hasMoved: false
    }
    fromTile = null
}