import { get } from "svelte/store";
import {
    gameStore,
    timeElapsed,
    timeSpent,
    updateGameStore,
    updateToGameStore,
} from "./store";
import { EPlayerNum, GameSize, GameType } from "./types";

import {
    createGameRandomItems,
    initStore,
    setDimensions,
    shuffleArray,
} from "./constants";
import {
    Application,
    Assets,
    Container,
    Graphics,
    Sprite,
    Text,
} from "pixi.js";
import type { CreateGridOptions, GameElement } from "./types";
import { svgIconsArr } from "./manifest";

export const setGameFinished = () => {
    updateGameStore((state) => {
        state.isGameFinished = true;
        return state;
    });
};
export const resetLastTwoMoves = (activePlayerIndex) => {
    updateToGameStore("lastTwoMoves", []);
};

export const handleClickGameElement = (i, j) => {
    const gameStr = get(gameStore);
    console.log("handleClickGameElement", i, j, gameStr.lastTwoMoves);
    if (gameStr.lastTwoMoves.length >= 2) return;

    const currElement = gameStr.gameElements[i][j];
    currElement.isVisible = true;
    currElement.isActive = true;

    currElement.innerElement.visible = true;
    currElement.circle.interactive = false;
    console.log("currElement.innerElement", currElement.innerElement);
    if (gameStr.lastTwoMoves.length < 2) {
        updateToGameStore("lastTwoMoves", [
            ...gameStr.lastTwoMoves,
            currElement,
        ]);
    }

    updateToGameStore("movesTotal", get(gameStore).movesTotal + 1);
};

export const disableElementsActiveState = (unActiveGameArr) => {
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

export const onNewGameClick = () => {
    console.log("New Game");
    updateGameStore((state) => {
        state.gridType = GameType.SvgIconsArr;
        state.gridSize = GameSize.Four;
        state.playerNum = EPlayerNum.One;

        return state;
    });
    resetTimeElapsed();

    updateToGameStore("lastTwoMoves", []);
    updateToGameStore("screen", "main");
    updateToGameStore("elementsFound", 0);
    updateToGameStore("movesTotal", 0);
};
let app: Application;

export const setApp = (gameApp: Application) => {
    app = gameApp;
};
export const onRestartClick = async () => {
    console.log(app);
    if (app) {
        await destroyGameElements().then(async () => {
            await createGridz({
                appWidth: app.screen.width,
                appHeight: app.screen.height,
                rows: get(gameStore).gridSize,
                containerWidth: app.renderer.width,
                iconGrid: get(gameStore).gridType,
            }).then((res) => {
                console.log("restarted", res);
                app.stage.addChild(res);
            });
        });
    }
    timeSpent.start();
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
    resetTimeElapsed();
    // updateToGameStore("lastTwoMoves", []);
    updateToGameStore("screen", "game");
    updateToGameStore("movesTotal", 0);
    updateToGameStore("elementsFound", 0);
};
export const resetTimeElapsed = () => {
    timeElapsed.set("0:00");
};

export const updateGameElementsVisibility = (
    updateGameArr = [],
    isVisible = false
) => {
    return new Promise((resolve) => {
        // updateGameStore((state) => {
        console.log("hideGameArr", updateGameArr);
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

                    console.log("currElementHideCircle", currElementHideCircle);
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
export const destroyGameElements = () => {
    console.log("start destroying");

    return new Promise<void>((resolve) => {
        const gameStr = get(gameStore);
        const gameElements = gameStr.gameElements;

        const promises = gameElements.map((row, i) => {
            return new Promise<void>((resolveElement) => {
                if (row?.length) {
                    console.log("destroyGameElements", row);
                    row.filter((cols) => {
                        console.log(cols);
                        cols.circle?.destroy();
                        cols.innerElement?.destroy();
                        return false;
                    });
                }

                resolveElement();
            });
        });

        Promise.all(promises).then(() => {
            console.log("done destroying");
            resolve();
        });
    });
};

export const createGridz = ({
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
        console.log(`Grid Size: ${gridSize}, Number of Icons: ${icons.length}`);
        if (gridSize / 2 >= icons.length) {
            console.error("Grid size larger than available icons");
            return resolve(new Container());
        }

        const gameElements = createGameRandomItems(gridSize);

        console.log(
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
        console.log(
            `Current Circle: ${currentCircle}, Icons: ${icons}, Game Elements: ${gameElements}`
        );

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
                        fontWeight: "bolder",
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

                circle.on("mousedown", () => {
                    console.log(
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
            console.log("Done creating grid");
            resolve(gridContainer);
        });
    });
};
