// game logic, i.e. movement, checks, en passante, etc.
import { PIECES } from "./set_up.js"

export function validMoves(tile, board) { // return a list of valid position objects, which correspond to possible moves for a given piece
    let valid = []
    const piece = tile.piece

    if (pinned(piece)) { // change eventually: pinned pieces CAN move sometimes, just can't move out of the pin
        return []
    }
    else if (piece.name === PIECES.PAWN) {
        valid = possiblePawnMoves(tile, board)
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
    else if (piece.name === PIECES.BISHOP) { // BISHOP
        valid = possibleBishopMoves(tile, board)
    }
    else if (piece.name === PIECES.QUEEN) { // QUEEN
        valid = possibleQueenMoves(tile, board)
    }
    else if (piece.name === PIECES.KING) { // KING
        valid = possibleKingMoves(tile, board)
    }
    else { // pieces that haven't been implemented yet
        board.forEach(row => {
            row.forEach(boardTile => {
                valid.push({ x: boardTile.x, y: boardTile.y })
            })
        })
    }
    console.log(valid)
    return valid
}

export function findKing(board, color) {
    const pos = { x: -1, y: -1 }
    board.some(row => {
        row.some(tile => {
            if (tile.piece.name === PIECES.KING && tile.piece.white === color) {
                pos.x = tile.x
                pos.y = tile.y
                return
            }
        })
    })
    return pos
}

function pinned(piece) {
    return false
}

export function inCheck(x, y, board, color) { // tile is the King's tile
    return (checkCheckHorizontal(board, x, y, 1, color) || checkCheckHorizontal(board, x, y, -1, color) ||
            checkCheckVertical(board, x, y, 1, color) || checkCheckVertical(board, x, y, -1, color))
}

function checkCheckHorizontal(board, a, b, x_move, color) {
    let x = a + x_move
    let y = b
    while (x >= 0 && x < 8) {
        if(board[y][x].piece.name === PIECES.EMPTY || board[y][x].piece.white === color && board[y][x].piece.name === PIECES.KING) {
            x += x_move // if the tile is empty, keep going
        }
        else if (board[y][x].piece.white === color) {
            return false // if the piece is white and not your own king, not in check in this direction
        }
        else if (board[y][x].piece.white !== color &&
           (board[y][x].piece.name === PIECES.QUEEN || 
            board[y][x].piece.name === PIECES.ROOK)) {
                console.log(board[y][x])
            return true // if it's not white and it's a queen or rook, you're in check
        }
        else {
            return false
        }
    }
    return false
}

function checkCheckVertical(board, a, b, y_move, color) {
    let x = a
    let y = b + y_move
    while (y >= 0 && y < 8) {
        if(board[y][x].piece.name === PIECES.EMPTY || board[y][x].piece.white === color && board[y][x].piece.name === PIECES.KING) {
            y += y_move // if the tile is empty, keep going
        }
        else if (board[y][x].piece.white === color) {
            return false // if the piece is white and not your own king, not in check in this direction
        }
        else if (board[y][x].piece.white !== color &&
           (board[y][x].piece.name === PIECES.QUEEN || 
            board[y][x].piece.name === PIECES.ROOK)) {
                console.log(board[y][x])
            return true // if it's not white and it's a queen or rook, you're in check
        }
        else {
            return false
        }
    }
    return false
}

function possiblePawnMoves(tile, board) {
    const candidates = []
    if (tile.piece.white) {  // white
        if (!tile.piece.hasMoved && board[tile.y - 2][tile.x].piece.name === PIECES.EMPTY) {
            candidates.push({ x: tile.x, y: tile.y - 2 })
        }
        if (board[tile.y - 1][tile.x].piece.name === PIECES.EMPTY) {
            candidates.push({ x: tile.x, y: tile.y - 1 })
        }
        if (tile.x > 0 && (board[tile.y - 1][tile.x - 1].piece.white !== tile.piece.white && 
            board[tile.y - 1][tile.x - 1].piece.name !== PIECES.EMPTY ||
            board[tile.y][tile.x - 1].piece.white !== tile.piece.white && board[tile.y][tile.x - 1].piece.name !== PIECES.EMPTY &&
            board[tile.y][tile.x - 1].piece.enPassantable === true)) {
            candidates.push({ x: tile.x - 1, y: tile.y - 1})
        }
        if (tile.x < 7 && (board[tile.y - 1][tile.x + 1].piece.white !== tile.piece.white && 
            board[tile.y - 1][tile.x + 1].piece.name !== PIECES.EMPTY ||
            board[tile.y][tile.x + 1].piece.white !== tile.piece.white && board[tile.y][tile.x + 1].piece.name !== PIECES.EMPTY &&
            board[tile.y][tile.x + 1].piece.enPassantable === true)) {
            candidates.push({ x: tile.x + 1, y: tile.y - 1})
        }
    }
    else {  // black
        if (!tile.piece.hasMoved && board[tile.y + 2][tile.x].piece.name === PIECES.EMPTY) {
            candidates.push({ x: tile.x, y: tile.y + 2 })
        }
        if (board[tile.y + 1][tile.x].piece.name === PIECES.EMPTY) {
            candidates.push({ x: tile.x, y: tile.y + 1 })
        }
        if (tile.x > 0 && (board[tile.y + 1][tile.x - 1].piece.white !== tile.piece.white && 
            board[tile.y + 1][tile.x - 1].piece.name !== PIECES.EMPTY ||
            board[tile.y][tile.x - 1].piece.white !== tile.piece.white && board[tile.y][tile.x - 1].piece.name !== PIECES.EMPTY &&
            board[tile.y][tile.x - 1].piece.enPassantable === true)) {
            candidates.push({ x: tile.x - 1, y: tile.y + 1})
        }
        if (tile.x < 7 && (board[tile.y + 1][tile.x + 1].piece.white !== tile.piece.white && 
            board[tile.y + 1][tile.x + 1].piece.name !== PIECES.EMPTY ||
            board[tile.y][tile.x + 1].piece.white !== tile.piece.white && board[tile.y][tile.x + 1].piece.name !== PIECES.EMPTY &&
            board[tile.y][tile.x + 1].piece.enPassantable === true)) {
            candidates.push({ x: tile.x + 1, y: tile.y + 1})
        }
    }
    return candidates
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
    
    return candidates
}

function possibleBishopMoves(tile, board) {
    const candidates = []

    checkFourtyFive(board, tile, candidates, -1) // -1 for bottom-left, 1 for top-right
    checkFourtyFive(board, tile, candidates, 1)
    checkOneThirtyFive(board, tile, candidates, -1)
    checkOneThirtyFive(board, tile, candidates, 1)

    return candidates
}

function possibleQueenMoves(tile, board) {
    const candidates = []

    checkHorizontal(board, tile, candidates, -1) // -1 for left, 1 for right
    checkHorizontal(board, tile, candidates, 1)
    checkVertical(board, tile, candidates, -1)
    checkVertical(board, tile, candidates, 1)
    checkFourtyFive(board, tile, candidates, -1) // -1 for bottom-left, 1 for top-right
    checkFourtyFive(board, tile, candidates, 1)
    checkOneThirtyFive(board, tile, candidates, -1)
    checkOneThirtyFive(board, tile, candidates, 1)

    return candidates
}

function possibleKingMoves(tile, board) {
    const valid = []
    const candidates = [
        { x: tile.x + 1, y: tile.y + 1 },
        { x: tile.x + 1, y: tile.y - 1 },
        { x: tile.x + 1, y: tile.y + 0 },
        { x: tile.x + 0, y: tile.y + 1 },
        { x: tile.x + 0, y: tile.y - 1 },
        { x: tile.x - 1, y: tile.y + 1 },
        { x: tile.x - 1, y: tile.y + 0 },
        { x: tile.x - 1, y: tile.y - 1 } 
    ]
    candidates.forEach(position => { // check normal moves
        if (position.x >= 0 && position.x <= 7 && position.y >= 0 && position.y <= 7
            && !inCheck(position.x, position.y, board, tile.piece.white)) {
            valid.push(position)
        }
    })
    if (!tile.piece.hasMoved) { // check castling
        checkCastle(tile, board).forEach(move => {
            if (!inCheck(move.x, move.y, board, tile.piece.white)) {
                valid.push(move)
            }
        })
    }
    return valid
}

function checkCastle(tile, board) {
    let castleMoves = []
    if (board[tile.y][tile.x + 1].piece.name === PIECES.EMPTY && board[tile.y][tile.x + 2].piece.name === PIECES.EMPTY && 
        board[tile.y][tile.x + 3].piece.hasMoved === false) {
            castleMoves.push({ x: tile.x + 2, y: tile.y })
    }
    if (board[tile.y][tile.x - 1].piece.name === PIECES.EMPTY && board[tile.y][tile.x - 2].piece.name === PIECES.EMPTY &&
        board[tile.y][tile.x - 3].piece.name === PIECES.EMPTY && board[tile.y][tile.x - 4].piece.hasMoved === false) {
                castleMoves.push({ x: tile.x - 2, y: tile.y })
    }
    return castleMoves
}

function checkHorizontal(board, tile, candidates, x_move) {
    let x = tile.x + x_move
    let y = tile.y
    let onEnemy = false
    while (x >= 0 && x < 8 && (board[y][x].piece.name === PIECES.EMPTY && board[y][x].piece.white !== tile.piece.white || !onEnemy)) {
        if (board[y][x].piece.name !== PIECES.EMPTY) { // found a black piece
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
    while (y >= 0 && y < 8 && (board[y][x].piece.name === PIECES.EMPTY && board[y][x].piece.white !== tile.piece.white || !onEnemy)) {
        if (board[y][x].piece.name !== PIECES.EMPTY) { // found a black piece
            onEnemy = true
        }
        candidates.push({ x: x, y: y })
        y += y_move
    }
}

function checkFourtyFive(board, tile, candidates, sign) {
    let x = tile.x + sign
    let y = tile.y + sign
    let onEnemy = false
    while (y >= 0 && y < 8 && x >= 0 && x < 8 && (board[y][x].piece.name === PIECES.EMPTY && board[y][x].piece.white !== tile.piece.white || !onEnemy)) {
        if (board[y][x].piece.name !== PIECES.EMPTY) {
            onEnemy = true
        }
        candidates.push({ x: x, y: y })
        x += sign
        y += sign
    }
}

function checkOneThirtyFive(board, tile, candidates, sign) {
    let x = tile.x + sign
    let y = tile.y - sign
    let onEnemy = false
    while (y >= 0 && y < 8 && x >= 0 && x < 8 && (board[y][x].piece.name === PIECES.EMPTY && board[y][x].piece.white !== tile.piece.white || !onEnemy)) {
        if (board[y][x].piece.name !== PIECES.EMPTY) {
            onEnemy = true
        }
        candidates.push({ x: x, y: y })
        x += sign
        y -= sign
    }
}