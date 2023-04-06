// game logic, i.e. movement, checks, en passante, etc.
import { PIECES } from "./set_up.js"

export function legalMoves(board) {
    board.forEach(row => {
        row.forEach(tile => {
            if (tile.piece.white === turn && tile.piece.name !== PIECES.EMPTY && validMoves(tile, board).length !== 0) {
                console.log(tile)
                console.log(validMoves(tile, board))
                return false
            }
        })
    })
    return true
}

export function validMoves(tile, board) { // return a list of valid position objects, which correspond to possible moves for a given piece
    let possible_valid = []
    const piece = tile.piece

    if (piece.name === PIECES.PAWN) {
        possible_valid = possiblePawnMoves(tile, board)
    }
    else if (piece.name === PIECES.KNIGHT) { // KNIGHT
        possible_valid = possibleKnightMoves(tile)
    }
    else if (piece.name === PIECES.ROOK) { // ROOK
        possible_valid = possibleRookMoves(tile, board)
    }
    else if (piece.name === PIECES.BISHOP) { // BISHOP
        possible_valid = possibleBishopMoves(tile, board)
    }
    else if (piece.name === PIECES.QUEEN) { // QUEEN
        possible_valid = possibleQueenMoves(tile, board)
    }
    else if (piece.name === PIECES.KING) { // KING
        possible_valid = possibleKingMoves(tile, board)
    }
    else { // pieces that haven't been implemented yet
        board.forEach(row => {
            row.forEach(boardTile => {
                possible_valid.push({ x: boardTile.x, y: boardTile.y })
            })
        })
    }
    return pruneValid(tile, possible_valid, board, tile.piece.white)
}

function pruneValid(tile, potential, board, color) {
    // for every move in potential: 
    //  temporarily remove piece
    //  make the move
    //  check inCheck()
    //  if you're now in check, don't push to final moves list

    const fromTemp = {...tile.piece}

    tile.piece = {
        name: PIECES.EMPTY,
        image: '',
        white: true,
        hasMoved: false,
        enPassantable: false
    }
    const final = []
    potential.forEach(move => {
        let toTemp = board[move.y][move.x].piece
        board[move.y][move.x].piece = fromTemp
        const kingPos = findKing(board, color)
        if (!inCheck(kingPos.x, kingPos.y, board, color)) {
            final.push(move)
        }
        board[move.y][move.x].piece = toTemp
    })

    tile.piece = fromTemp
    return final
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

export function inCheck(x, y, board, color) { // tile is the King's tile
    return (checkCheckEightWay(board, x, y, 1, 0, color) || checkCheckEightWay(board, x, y, -1, 0, color) ||
        checkCheckEightWay(board, x, y, 0, 1, color) || checkCheckEightWay(board, x, y, 0, -1, color) ||
        checkCheckEightWay(board, x, y, 1, 1, color) || checkCheckEightWay(board, x, y, 1, -1, color) ||
        checkCheckEightWay(board, x, y, -1, 1, color) || checkCheckEightWay(board, x, y, -1, -1, color) ||
        checkCheckKnight(board, x, y, color) || checkCheckKingPawn(board, x, y, color))
}

function checkCheckKingPawn(board, x, y, color) {
    const candidates = [
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y + 0 },
        { x: x + 0, y: y + 1 },
        { x: x + 0, y: y - 1 },
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y + 0 },
        { x: x - 1, y: y - 1 } 
    ]

    return candidates.some(pos => {
        if (pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8 && 
            (pos.x - x !== 0 && pos.y - y === -1 * color && board[pos.y][pos.x].piece.name === PIECES.PAWN || 
            board[pos.y][pos.x].piece.name === PIECES.KING) && board[pos.y][pos.x].piece.white !== color) {
                console.log(board[pos.y][pos.x])
            return true
        }
    })
}

function checkCheckKnight(board, x, y, color) {
    const candidates = [
        { x: x + 2, y: y + 1 },
        { x: x + 1, y: y + 2 },
        { x: x - 2, y: y + 1 },
        { x: x + 1, y: y - 2 },
        { x: x - 2, y: y - 1 },
        { x: x - 1, y: y - 2 },
        { x: x + 2, y: y - 1 },
        { x: x - 1, y: y + 2 }
    ]

    return candidates.some(pos => {
        if (pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8 && 
                board[pos.y][pos.x].piece.white !== color && board[pos.y][pos.x].piece.name === PIECES.KNIGHT) {
                    return true
                }
    })
}

function checkCheckEightWay(board, a, b, x_move, y_move, color) {
    let x = a + x_move
    let y = b + y_move
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        if (board[y][x].piece.name === PIECES.EMPTY || board[y][x].piece.white === color && board[y][x].piece.name === PIECES.KING) {
            x += x_move // if the tile is empty or your king, keep going
            y += y_move
        }
        else if (board[y][x].piece.white === color) {
            return false // if the piece is white and not your own king, not in check in this direction
        }
        else if (board[y][x].piece.white !== color &&
            (x_move === 0 && y_move !== 0 || x_move !== 0 && y_move === 0) &&
           (board[y][x].piece.name === PIECES.QUEEN || 
            board[y][x].piece.name === PIECES.ROOK)) {
            return true // if it's not white and it's a queen or rook, you're in check
        }
        else if (board[y][x].piece.white !== color && x_move !== 0 && y_move !== 0 &&
           (board[y][x].piece.name === PIECES.QUEEN || 
            board[y][x].piece.name === PIECES.BISHOP)) {
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

    checkMoveEightWay(board, tile, candidates, -1, 0) // -1 for left, 1 for right
    checkMoveEightWay(board, tile, candidates, 1, 0)
    checkMoveEightWay(board, tile, candidates, 0, -1)
    checkMoveEightWay(board, tile, candidates, 0, 1)
    
    return candidates
}

function possibleBishopMoves(tile, board) {
    const candidates = []

    checkMoveEightWay(board, tile, candidates, -1, 1) // -1 for bottom-left, 1 for top-right
    checkMoveEightWay(board, tile, candidates, 1, -1)
    checkMoveEightWay(board, tile, candidates, -1, -1)
    checkMoveEightWay(board, tile, candidates, 1, 1)

    return candidates
}

function possibleQueenMoves(tile, board) {
    const candidates = []

    checkMoveEightWay(board, tile, candidates, -1, 0) // -1 for left, 1 for right
    checkMoveEightWay(board, tile, candidates, 1, 0)
    checkMoveEightWay(board, tile, candidates, 0, -1)
    checkMoveEightWay(board, tile, candidates, 0, 1)
    checkMoveEightWay(board, tile, candidates, 1, -1) // -1 for bottom-left, 1 for top-right
    checkMoveEightWay(board, tile, candidates, 1, 1)
    checkMoveEightWay(board, tile, candidates, -1, -1)
    checkMoveEightWay(board, tile, candidates, -1, 1)

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
            && !inCheck(position.x, position.y, board, tile.piece.white) && board[position.y][position.x].piece.name === PIECES.EMPTY) {
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
        board[tile.y][tile.x + 3].piece.hasMoved === false && 
        !inCheck(tile.x + 1, tile.y, board, tile.piece.white)) {
            castleMoves.push({ x: tile.x + 2, y: tile.y })
    }
    if (board[tile.y][tile.x - 1].piece.name === PIECES.EMPTY && board[tile.y][tile.x - 2].piece.name === PIECES.EMPTY &&
        board[tile.y][tile.x - 3].piece.name === PIECES.EMPTY && board[tile.y][tile.x - 4].piece.hasMoved === false &&
        !inCheck(tile.x - 1, tile.y, board, tile.piece.white)) {
                castleMoves.push({ x: tile.x - 2, y: tile.y })
    }
    return castleMoves
}

function checkMoveEightWay(board, tile, candidates, x_move, y_move) {
    let x = tile.x + x_move
    let y = tile.y + y_move
    let onEnemy = false
    while (x >= 0 && x < 8 && y >= 0 && y < 8 &&
        (board[y][x].piece.name === PIECES.EMPTY || board[y][x].piece.white !== tile.piece.white && !onEnemy)) {
        if (board[y][x].piece.name !== PIECES.EMPTY) { // found a black piece
            onEnemy = true
        }
        candidates.push({ x: x, y: y })
        x += x_move
        y += y_move
    }
}