# Chess
Chess app made w/ vanilla JS, HTML, CSS

`script.js` contains all of the code associated with rendering the chess game onto the webpage. 
`chess.js` contains game logic.
`setup.js` simply sets up the board at the beginning of every game.

Alternate branch `online` has online implemented with express and socket.io. Many games can be played at once
and users are automatically matched to each other.
`server.js` contains all of the back-end
`script.js` is also a bit different, as that's the file that communicates with the back end.

Pawns only promote to queen. Might add other pieces later, idk.