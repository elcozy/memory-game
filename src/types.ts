import type { Container, Graphics, Sprite, Text } from "pixi.js";

export enum GameSize {
    Four = 4,
    Six = 6,
}
export enum EPlayerNum {
    One,
    Two,
    Three,
    Four,
}
export enum GameType {
    Numbers,
    SvgIconsArr,
}
export interface GameElement {
    position: { row: number; column: number };
    value: number | null;
    circle: Graphics;
    circleRadius: number;
    innerElement: Sprite | Text;
    isVisible: boolean;
    isActive: boolean;
}

export interface CreateGridOptions {
    appWidth: number;
    appHeight: number;
    rows: GameSize;
    containerWidth: number;
    iconGrid: GameType;
}

export type TGameStore = {
    timeSpent: number;
    movesTotal: number;
    timeElapsed: string;
    gridType: GameType;
    gridSize: GameSize;
    screen: "game" | "main";
    gameElements: GameElement[][];
    playerNum: EPlayerNum;
    elementsFound: number;
    summaryPixi?: Container;

    moves: any[];
    pairs: any[];
    lastTwoMoves: any[];
    gameStarted: number;
    activePlayerIndex: number;
    isGameFinished: boolean;
};

type gameElement = {
    value: number;
    isVisible: boolean;
    isActive: boolean;
    iconColor: number;
};
