import { writable, type Writable } from "svelte/store";
import { GameSize, GameType } from "./constants";

export type GameStates = {
    timeSpent: number;

    gameElements: any[];
    minutesElapsed: 0;
    secondsElapsed: 0;
    moves: any[];
    pairs: any[];
    lastTwoMoves: any[];
    gameStarted: number;
    gridTheme: GameType;
    numOfPlayers: number;
    activePlayerIndex: number;
    gridSize: GameSize;
    isGameFinished: boolean;
};

const initialState: GameStates = {
    timeSpent: 0,
    gameElements: [],
    minutesElapsed: 0,
    secondsElapsed: 0,
    moves: [],
    pairs: [],
    lastTwoMoves: [],
    gameStarted: 0,
    gridTheme: GameType.Numbers,
    numOfPlayers: 1,
    activePlayerIndex: 0,
    gridSize: GameSize.Four,
    isGameFinished: false,
};

export const welcomeMessage: Writable<string> = writable("");
export const gameState: Writable<GameStates> = writable();
export const tempTime: Writable<string> = writable("0:00");
export const tempMoves: Writable<number> = writable(0);
