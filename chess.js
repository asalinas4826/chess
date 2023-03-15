// game logic, i.e. movement, checks, en passante, etc.
import { PIECES } from "./set_up.js"

export function validMoves(tile, selectedTile, board) { // return a list of valid position objects, which correspond to possible moves for a given piece
    let valid = []
    const piece = selectedTile.piece
    if (pinned(piece)) { // change eventually: pinned pieces CAN move sometimes, just can't move out of the pin
        return []
    }
    else if (piece.name === PIECES.KNIGHT) { // KNIGHT
        if (pinned(piece)) {
            return []
        }
        valid = possibleKnightMoves(tile)
    }
    else if (piece.name === PIECES.ROOK) { // ROOK
        valid = possibleRookMoves(tile, board)
    }
    else { // pieces that haven't been implemented yet
        board.forEach(row => {
            row.forEach(boardTile => {
                valid.push({ x: boardTile.x, y: boardTile.y })
            })
        })
    }
    return valid
}

function pinned(piece) {
    return false
}

function inCheck(board) {
    return false
}

function possibleKnightMoves(tile) {
    const valid = []
    const candidates = [
        { x: tile.x + 2, y: tile.y + 1 },
        { x: tile.x + 1, y: tile.y + 2 },
        { x: tile.x - 2, y: tile.y + 1 },
        { x: tile.x + 1, y: tile.y - 2 },
        { x: tile.x - 2, y: tile.y - 1 },
        { x: tile.x - 1, y: tile.y - 2 },
        { x: tile.x + 2, y: tile.y - 1 },
        { x: tile.x - 1, y: tile.y + 2 }
    ]
    candidates.forEach(position => {
        if (position.x >= 0 && position.x <= 7 && position.y >= 0 && position.y <= 7) {
            valid.push(position)
        }
    })
    return valid
}

function possibleRookMoves(tile, board) {
    const candidates = []

    checkHorizontal(board, tile, candidates, -1) // -1 for left, 1 for right
    checkHorizontal(board, tile, candidates, 1)
    checkVertical(board, tile, candidates, -1)
    checkVertical(board, tile, candidates, 1)
    console.log("candidates: ", candidates)
    
    return candidates
}

function checkHorizontal(board, tile, candidates, x_move) {
    let x = tile.x + x_move
    let y = tile.y
    let onEnemy = false
    while (x >= 0 && x < 8 && (board[y][x].piece.name === PIECES.EMPTY || !onEnemy)) {
        if (board[y][x].piece.white !== tile.piece.white && board[y][x].piece.name !== PIECES.EMPTY) { // found a black piece
            onEnemy = true
        }
        candidates.push({ x: x, y: y })
        x += x_move
    }
}

function checkVertical(board, tile, candidates, y_move) {
    let x = tile.x
    let y = tile.y + y_move
    let onEnemy = false
    while (y >= 0 && y < 8 && (board[y][x].piece.name === PIECES.EMPTY || !onEnemy)) {
        if (board[y][x].piece.white !== tile.piece.white && board[y][x].piece.name !== PIECES.EMPTY) { // found a black piece
            onEnemy = true
        }
        candidates.push({ x: x, y: y })
        y += y_move
    }
}