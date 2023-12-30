import { get } from "svelte/store";
import {
    gameStore,
    timeSpent,
    updateGameStore,
    updateToGameStore,
} from "../store";
import { EPlayerNum, GameSize, GameType } from "../types";

import {
    createGameRandomItems,
    initStore,
    setDimensions,
    shuffleArray,
} from "../constants";
import {
    Application,
    Assets,
    Container,
    Graphics,
    Sprite,
    Text,
} from "pixi.js";
import type { CreateGridOptions, GameElement } from "../types";
import { svgIconsArr } from "../manifest";
import { stopAnimation, Logger } from "./index";

const setGameFinished = () => {
    updateGameStore((state) => {
        state.isGameFinished = true;
        return state;
    });
};
const resetLastTwoMoves = (activePlayerIndex) => {
    updateToGameStore("lastTwoMoves", []);
};

const handleClickGameElement = (i, j) => {
    const gameStr = get(gameStore);
    Logger.log("handleClickGameElement", i, j, gameStr.lastTwoMoves);
    if (gameStr.lastTwoMoves.length >= 2) return;

    const currElement = gameStr.gameElements[i][j];
    currElement.isVisible = true;
    currElement.isActive = true;

    currElement.innerElement.visible = true;
    currElement.circle.interactive = false;
    Logger.log("currElement.innerElement", currElement.innerElement);
    if (gameStr.lastTwoMoves.length < 2) {
        updateToGameStore("lastTwoMoves", [
            ...gameStr.lastTwoMoves,
            currElement,
        ]);
    }
};

const disableElementsActiveState = (unActiveGameArr) => {
    updateGameStore((state) => {
        unActiveGameArr.forEach((elementToHide) => {
            const currElementHide =
                state.gameElements[elementToHide.position.row][
                    elementToHide.position.column
                ];
            currElementHide.isActive = false;
        });

        return state;
    });
};

let app: Application;
let interval: NodeJS.Timeout;

const startTimer = () => {
    interval = setInterval(() => {
        timeSpent.secUpdate((prev) => {
            const newSec = prev + 1;

            const minutes = Math.floor(newSec / 60);
            const remainingSeconds: number = newSec % 60;

            const formattedTime: `${number}:${number}` =
                remainingSeconds < 10
                    ? `${minutes}:0${remainingSeconds}`
                    : (`${minutes}:${remainingSeconds}` as any);

            timeSpent.set(formattedTime);
            return newSec;
        });
    }, 1000);
    // interval =
};
const clearTimer = () => {
    if (interval) {
        clearInterval(interval);
    }
};
const pauseTimer = () => {
    clearTimer();
};

const setApp = (gameApp: Application) => {
    app = gameApp;
};

const onNewGameClick = async () => {
    Logger.log("New Game");

    if (app) {
        if (get(gameStore).summaryPixi) {
            stopAnimation(get(gameStore).summaryPixi);
            app.stage?.removeChild(get(gameStore).summaryPixi);
        }
    }
    updateGameStore((state) => {
        state.gridType = GameType.SvgIconsArr;
        state.gridSize = GameSize.Four;
        state.playerNum = EPlayerNum.One;

        return state;
    });
    timeSpent.reset();

    updateToGameStore("lastTwoMoves", []);
    updateToGameStore("screen", "main");
    updateToGameStore("elementsFound", 0);
    updateToGameStore("movesTotal", 0);
};
const onRestartClick = async () => {
    Logger.log(app);
    if (app) {
        if (get(gameStore).summaryPixi) {
            stopAnimation(get(gameStore).summaryPixi);

            app.stage?.removeChild(get(gameStore).summaryPixi);
        }

        await destroyGameBoard().then(async () => {
            await createGridz({
                appWidth: app.screen.width,
                appHeight: app.screen.height,
                rows: get(gameStore).gridSize,
                containerWidth: app.renderer.width,
                iconGrid: get(gameStore).gridType,
            }).then((res) => {
                Logger.log("restarted", res);
                app.stage.addChild(res);
            });
        });
    }
    timeSpent.reset();
    clearTimer();
    startTimer();

    // gameStore.update((prev) => {
    //     return {
    //         ...initStore,
    //         gridType: prev.gridType,
    //         gridSize: prev.gridSize,
    //         playerNum: prev.playerNum,
    //         gameElements: prev.gameElements,
    //     };
    // });

    updateGameStore((state) => {
        state.timeSpent = initStore.timeSpent;
        return state;
    });
    timeSpent.reset();

    // updateToGameStore("lastTwoMoves", []);
    updateToGameStore("screen", "game");
    updateToGameStore("movesTotal", 0);
    updateToGameStore("elementsFound", 0);
};

const updateGameElementsVisibility = (
    updateGameArr = [],
    isVisible = false
) => {
    return new Promise((resolve) => {
        // updateGameStore((state) => {
        Logger.log("hideGameArr", updateGameArr);
        const state = get(gameStore);
        const promises = updateGameArr.map((elementToHide) => {
            return new Promise<void>((resolveElement) => {
                const currElementHide =
                    state.gameElements[elementToHide.position.row][
                        elementToHide.position.column
                    ];
                if (isVisible) {
                    updateToGameStore(
                        "elementsFound",
                        get(gameStore).elementsFound + 1
                    );
                }
                currElementHide.isVisible = isVisible;
                currElementHide.innerElement.visible = isVisible;

                const currElementHideCircle = currElementHide.circle;

                if (currElementHideCircle) {
                    currElementHideCircle.interactive = !isVisible;
                    currElementHideCircle.cursor = !isVisible
                        ? "pointer"
                        : "default";

                    Logger.log("currElementHideCircle", currElementHideCircle);
                    currElementHideCircle.clear();
                    currElementHideCircle.beginFill(
                        isVisible ? 0xbcced9 : 0x304859
                    );
                    currElementHideCircle.drawCircle(
                        0,
                        0,
                        currElementHide.circleRadius
                    );
                    currElementHideCircle.endFill();
                }

                resolveElement();
            });
        });

        Promise.all(promises).then(() => {
            updateToGameStore("gameElements", state.gameElements);
            resolve(state);
        });

        // return state;
        // });
    });
};
const destroyGameElements = () => {
    Logger.log("start destroying");

    return new Promise<void>((resolve) => {
        const gameStr = get(gameStore);
        const gameElements = gameStr.gameElements;

        const promises = gameElements.map((row, i) => {
            return new Promise<void>((resolveElement) => {
                if (row?.length) {
                    Logger.log("destroyGameElements", row);
                    row.filter((cols) => {
                        // Logger.log(cols);
                        cols.circle?.destroy();
                        cols.innerElement?.destroy();
                        return false;
                    });
                }

                resolveElement();
            });
        });

        Promise.all(promises).then(() => {
            Logger.log("done destroying");
            resolve();
        });
    });
};
const destroyGameBoard = () => {
    Logger.log("start destroying board");

    return new Promise<void>((resolve) => {
        const gameStr = get(gameStore);
        const gridContainer = gameStr.gridContainer;
        gridContainer?.destroy({
            children: true,
        });

        if (app && gridContainer) {
            app.stage?.removeChild(gridContainer);
        }

        resolve();
    });
};

const createGridz = ({
    appWidth,
    appHeight,
    rows,
    containerWidth,
    iconGrid,
}: CreateGridOptions): Promise<Container> => {
    const columns = rows;
    const icons = shuffleArray(svgIconsArr);

    return new Promise((resolve) => {
        const newGameElements: GameElement[][] = [];

        const gameBoardP = get(gameStore).gridSize === 6 ? 10 : 30;
        const gameCircleDiameter = get(gameStore).gridSize === 6 ? 82 : 118;
        const gameCircleGaps = get(gameStore).gridSize === 6 ? 16 : 20;
        const gap = 10;
        let circleRadius = gameCircleDiameter / 2;

        const gridSize = Math.pow(rows, 2);
        Logger.log(`Grid Size: ${gridSize}, Number of Icons: ${icons.length}`);
        if (gridSize / 2 >= icons.length) {
            Logger.error("Grid size larger than available icons");
            return resolve(new Container());
        }

        const gameElements = createGameRandomItems(gridSize);

        Logger.log(
            `Container Width: ${containerWidth}, Circle Radius: ${circleRadius}, Scaled Radius: ${
                circleRadius / 1.7
            }`
        );

        let gridContainer: Container = new Container();
        let gameBoardBg: Graphics = new Graphics();

        gameBoardBg.beginFill(0xfcfcfc);
        gameBoardBg.drawRect(0, 0, 592, 592);
        gameBoardBg.endFill();

        gridContainer.position.set(appWidth / 2 - gameBoardBg.width / 2, 0);

        let currentCircle = 0;

        gridContainer.addChild(gameBoardBg);

        const createGridRow = async (i: number) => {
            const rowsArr: GameElement[] = [];
            for (let j = 0; j < columns; j++) {
                const circle = new Graphics();
                const currGameElement = gameElements[currentCircle];
                const elementColor = 0xfda214;
                circle.beginFill(elementColor);
                circle.drawCircle(0, 0, circleRadius);
                circle.endFill();

                const startPos = gameCircleDiameter / 2 + gameBoardP;
                const x = i * (gameCircleDiameter + gameCircleGaps) + startPos;
                const y = j * (gameCircleDiameter + gameCircleGaps) + startPos;

                circle.position.set(x, y);

                circle.interactive = true;
                circle.cursor = "pointer";

                let circleShape: Sprite | undefined;
                let circleNumber: Text | undefined;
                let element: Sprite | Text;

                if (iconGrid) {
                    circleShape = Sprite.from(
                        Assets.get(icons[currGameElement.value])
                    );
                    element = circleShape;
                    setDimensions(null, circleRadius / 1.5, circleShape);

                    circleShape.anchor.set(0.5);
                    circleShape.position.set(x, y);
                } else {
                    circleNumber = new Text(currGameElement.value!.toString(), {
                        fontFamily: "AtkinsonHyperlegible Bold",
                        fontSize: 40,
                        fill: 0xffffff,
                    });
                    element = circleNumber;
                    circleNumber.anchor.set(0.5);
                    circleNumber.position.set(x, y);
                }

                const setOpenState = (isOpen = true) => {
                    circle.clear();
                    circle.beginFill(isOpen ? elementColor : 0x304859);
                    circle.drawCircle(0, 0, circleRadius);
                    circle.endFill();
                };

                const setHoverState = (isOver = true) => {
                    if (element.visible) return;
                    circle.clear();
                    circle.beginFill(
                        isOver
                            ? 0x6395b8
                            : element.visible
                            ? elementColor
                            : 0x304859
                    );
                    circle.drawCircle(0, 0, circleRadius);
                    circle.endFill();
                };

                element.visible = false;
                setOpenState(element.visible);

                currGameElement.isVisible = element.visible;

                circle.on("pointerdown", () => {
                    Logger.log(
                        `Clicked on: ${i}, ${j}, Current Circle: ${currentCircle}`
                    );
                    handleClickGameElement(i, j);
                    setOpenState(element.visible);
                });

                circle.on("pointerover", () => {
                    setHoverState(true);
                });

                circle.on("pointerout", () => {
                    setHoverState(false);
                });

                currentCircle++;
                gridContainer.addChild(circle);
                if (iconGrid) {
                    gridContainer.addChild(circleShape!);
                } else {
                    gridContainer.addChild(circleNumber!);
                }

                const newObj: GameElement = {
                    position: { row: i, column: j },
                    value: null,
                    circle,
                    circleRadius,
                    innerElement: element,
                    ...currGameElement,
                };

                rowsArr.push(newObj);
            }
            return rowsArr;
        };

        const createGridRowsPromises = Array.from({ length: rows }, (_, i) =>
            createGridRow(i)
        );

        Promise.all(createGridRowsPromises).then((gridRows) => {
            newGameElements.push(...gridRows); // flatten the array of arrays

            updateToGameStore("gameElements", newGameElements);
            updateToGameStore("gridContainer", gridContainer);
            Logger.log("Done creating grid");
            resolve(gridContainer);
        });
    });
};

const createBtn = ({
    width,
    height,
    radius = 0,
    defaultColor,
    hoverColor,
    onClickAction,
}: {
    width: number;
    height: number;
    radius: number;
    defaultColor: number;
    hoverColor: number;
    onClickAction: () => void;
}) => {
    const customBtn = new Graphics();

    customBtn.beginFill(defaultColor);
    customBtn.drawRoundedRect(0, 0, width, height, radius);
    customBtn.endFill();

    customBtn.interactive = true;
    customBtn.cursor = "pointer";
    const setStateBg = (color) => {
        customBtn.clear();
        customBtn.beginFill(color);
        customBtn.drawRoundedRect(0, 0, width, height, radius);
        customBtn.endFill();
    };

    customBtn.on("pointerdown", () => {
        onClickAction();
    });

    customBtn.on("pointerover", () => {
        setStateBg(hoverColor);
    });

    customBtn.on("pointerout", () => {
        setStateBg(defaultColor);
    });

    return customBtn;
};
const createGraphics = ({
    width,
    height,
    radius = 0,
    defaultColor,
}: {
    width: number;
    height: number;
    radius: number;
    defaultColor: number;
}) => {
    const customBtn = new Graphics();

    customBtn.beginFill(defaultColor);
    customBtn.drawRoundedRect(0, 0, width, height, radius);
    customBtn.endFill();

    return customBtn;
};

function createModalSummary(timeTaken = "0:00", movesUsed = 0) {
    const summaryContainer = new Container();
    const defSty = {
        fontFamily: "AtkinsonHyperlegible Bold",
        fontSize: 18,
    };
    const summaryContainerBg = createGraphics({
        width: 654,
        height: 510,
        radius: 20,
        defaultColor: 0xf2f2f2,
    });
    const timeBg = createGraphics({
        width: 542,
        height: 72,
        radius: 10,
        defaultColor: 0xdfe7ec,
    });
    const movesBg = createGraphics({
        width: 542,
        height: 72,
        radius: 10,
        defaultColor: 0xdfe7ec,
    });
    const restartBg = createBtn({
        width: 264,
        height: 52,
        radius: 25,
        defaultColor: 0xfda214,
        hoverColor: 0xffb84a,
        onClickAction: onRestartClick,
    });
    const newGameBg = createBtn({
        width: 264,
        height: 52,
        radius: 25,
        defaultColor: 0xdfe7ec,
        hoverColor: 0xbcced9,
        onClickAction: onNewGameClick,
    });
    const youDidTxtPixi = new Text("You did it!", {
        ...defSty,
        fontSize: 48,
        fill: 0x152938,
    });
    const gameOverTxtPixi = new Text("Game over! Here’s how you got on…", {
        ...defSty,
        fontSize: 20,
        fill: 0x7191a5,
    });
    const timeElapsedTxtPixi = new Text("Time Elapsed", {
        ...defSty,
        fill: 0x7191a5,
    });
    const movesTakenTxtPixi = new Text("Moves Taken", {
        ...defSty,
        fill: 0x7191a5,
    });
    const movesTxtPixi = new Text(`${movesUsed} Moves`, {
        ...defSty,
        fill: 0x304859,
        fontSize: 32,
    });
    const timeTxtPixi = new Text(`${timeTaken}`, {
        ...defSty,
        fill: 0x304859,
        fontSize: 32,
    });
    const restartTxtPixi = new Text("Restart", {
        ...defSty,
        fontSize: 20,
        fill: 0xfcfcfc,
    });
    const setupNewGameTxtPixi = new Text("Setup New Game", {
        ...defSty,
        fontSize: 20,
        fill: 0x304859,
    });
    summaryContainerBg.position.set(0);

    timeBg.position.set(56, 189);
    movesBg.position.set(56, 277);

    restartBg.position.set(56, 389);
    newGameBg.position.set(334, 389);

    youDidTxtPixi.position.set(
        summaryContainerBg.width / 2 - youDidTxtPixi.width / 2,
        51
    );
    gameOverTxtPixi.position.set(
        summaryContainerBg.width / 2 - gameOverTxtPixi.width / 2,
        127
    );
    timeElapsedTxtPixi.position.set(
        timeBg.x + 32,
        timeBg.y + timeBg.height / 2 - timeElapsedTxtPixi.height / 2
    );
    movesTakenTxtPixi.position.set(
        movesBg.x + 32,
        movesBg.y + movesBg.height / 2 - movesTakenTxtPixi.height / 2
    );
    movesTxtPixi.position.set(
        movesBg.x + movesBg.width - movesTxtPixi.width - 32,
        movesBg.y + movesBg.height / 2 - movesTxtPixi.height / 2
    );
    timeTxtPixi.position.set(
        timeBg.x + timeBg.width - timeTxtPixi.width - 32,
        timeBg.y + timeBg.height / 2 - timeTxtPixi.height / 2
    );
    restartTxtPixi.position.set(
        restartBg.x + restartBg.width / 2 - restartTxtPixi.width / 2,

        restartBg.y + restartBg.height / 2 - restartTxtPixi.height / 2
    );
    setupNewGameTxtPixi.position.set(
        newGameBg.x + newGameBg.width / 2 - setupNewGameTxtPixi.width / 2,

        newGameBg.y + newGameBg.height / 2 - setupNewGameTxtPixi.height / 2
    );
    summaryContainer.addChild(
        summaryContainerBg,
        timeBg,
        movesBg,
        restartBg,
        newGameBg,
        newGameBg,
        youDidTxtPixi,
        gameOverTxtPixi,
        timeElapsedTxtPixi,
        movesTakenTxtPixi,
        movesTxtPixi,
        timeTxtPixi,
        restartTxtPixi,
        setupNewGameTxtPixi
    );

    return summaryContainer;
}

export {
    setGameFinished,
    resetLastTwoMoves,
    handleClickGameElement,
    disableElementsActiveState,
    startTimer,
    clearTimer,
    pauseTimer,
    setApp,
    onNewGameClick,
    onRestartClick,
    updateGameElementsVisibility,
    destroyGameElements,
    destroyGameBoard,
    createGridz,
    createBtn,
    createGraphics,
    createModalSummary,
};
