import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

import "./App.scss";

import { createContext } from "react";

const theme = createContext("light");
console.log(theme);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Square({ children, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [games, storeGame] = React.useState([]);
  const [gameCount, setGameCount] = React.useState(1);
  const [winStreak, setWinStreak] = React.useState({ X: 0, O: 0 });
  const [xIsNext, setXIsNext] = React.useState(true);
  const [restoredGame, isRestoredGame] = React.useState(false);
  const [squares, setSquares] = React.useState(Array(9).fill(null));

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner is " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  if (!winner && squares.includes(null) === false) {
    status = "No moves left!";
  }

  function restoreGame(results) {
    setSquares(Array(9).fill(null));
    setSquares(results.slice());
    isRestoredGame(true);
  }

  function resetBoard() {
    if (winner && !restoredGame) {
      winStreak[winner]++;
      if (games.length > 5) {
        games.shift();
      }

      setGameCount(gameCount + 1);
      games.push({
        game: gameCount,
        winner: winner,
        results: squares,
      });
    }

    isRestoredGame(false);
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <Container maxWidth="md" disableGutters={true}>
      <Stack
        spacing={4}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <h1>Tic Tac Toe!</h1>
        <h2>{status}</h2>
        <Grid container justifyContent="center">
          {/* board & results */}
          <Grid item xs={12} sm={10} md={6}>
            {/* board */}
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={0}>
              {Array.from(Array(9)).map((_, index) => (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                >
                  {squares[index]}
                </Square>
              ))}
            </Box>
          </Grid>
          {/* board */}
          <Grid item xs={12} sm={10} md={6}>
            {/* results */}
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" width={100}>
                      Game
                    </TableCell>
                    <TableCell align="center" width={100}>
                      Winner
                    </TableCell>
                    <TableCell align="center" width={100}>
                      Results
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(games).map((game) => (
                    <TableRow
                      key={game.game}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center" width={100}>
                        {game.game}
                      </TableCell>
                      <TableCell align="center" width={100}>
                        {game.winner}
                      </TableCell>
                      <TableCell align="center" width={100}>
                        <Button onClick={() => restoreGame(game.results)}>
                          Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* results */}
        </Grid>
        {/*  board & results */}
        <Grid container direction="row" justifyContent="center">
          {/* winstreak */}
          <Grid item xs={6} sm={5} md={6}>
            <Item>Wins (X): {winStreak.X}</Item>
          </Grid>
          <Grid item xs={6} sm={5} md={6}>
            <Item>Wins (O): {winStreak.O}</Item>
          </Grid>
        </Grid>
        {/* winstreak */}
        <Button onClick={resetBoard} variant="contained" size="large">
          Restart
        </Button>
      </Stack>
    </Container>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
