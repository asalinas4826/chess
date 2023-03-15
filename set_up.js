export const PIECES = {
    KING: 'king',
    QUEEN: 'queen',
    BISHOP: 'bishop',
    KNIGHT: 'knight', 
    ROOK: 'rook',
    PAWN: 'pawn',
    EMPTY: 'empty'
}

export function createBoard() {
    const board = []
    for (let r = 0; r < 8; r++) {
        const row = []
        for (let c = 0; c < 8; c++) {
            const element = document.createElement('div')
            if ((r + c) % 2 === 0) {    // NOT piece color, this is just the board tiles
                element.dataset.color = "white"
            }
            else {
                element.dataset.color = "black"
            }
            const tile = {
                element,
                x: c,
                y: r,
                piece: {
                    name: PIECES.EMPTY,
                    image: '',
                    white: true
                }
            }
            row.push(tile)
        }
        board.push(row)
    }

    setPieces(board)
    return board
}

function setPieces(board) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col].piece
            if (row <= 1) {
                piece.white = false
            }
            
            if (row === 1 || row === 6) {   // pawns
                piece.name = PIECES.PAWN
                if (piece.white) {
                    piece.image = 'images/pawnW2.png'
                }
                else {
                    piece.image = 'images/pawnB2.png'
                }                
            }
            else if (row === 0 || row === 7) {
                switch (col) {
                    case 0: // rooks
                    case 7:
                        piece.name = PIECES.ROOK
                        if (piece.white) {
                            piece.image = 'images/rookW2.png'
                        }
                        else {
                            piece.image = 'images/rookB2.png'
                        }
                        break
                    case 1: // knights
                    case 6:
                        piece.name = PIECES.KNIGHT
                        if (piece.white) {
                            piece.image = 'images/knightW2.png'
                        }
                        else {
                            piece.image = 'images/knightB2.png'
                        }
                        break
                    case 2: // bishops
                    case 5:
                        piece.name = PIECES.BISHOP
                        if (piece.white) {
                            piece.image = 'images/bishopW2.png'
                        }
                        else {
                            piece.image = 'images/bishopB2.png'
                        }
                        break
                    case 3: // queen
                        piece.name = PIECES.QUEEN
                        if (piece.white) {
                            piece.image = 'images/queenW2.png'
                        }
                        else {
                            piece.image = 'images/queenB2.png'
                        }
                        break
                    case 4: // king
                        piece.name = PIECES.KING
                        if (piece.white) {
                            piece.image = 'images/kingW2.png'
                        }
                        else {
                            piece.image = 'images/kingB2.png'
                        }
                        break
                }
            }
            else {
                piece.name = PIECES.EMPTY
            }
            if (piece.name !== PIECES.EMPTY) addPieceToElement(row, col, piece, board)
        }
    }
}

export function addPieceToElement(y, x, piece, board) {
    const element = board[y][x].element
    const imageElement = document.createElement('img')
    imageElement.src = piece.image
    element.appendChild(imageElement)
}