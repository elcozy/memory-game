<script lang="ts">
    import {
        Application,
        Assets,
        Container,
        FXAAFilter,
        Graphics,
        RenderTexture,
        Sprite,
        Text,
    } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { svgIconsArr } from "../manifest";
    import {
        EPlayerNum,
        GameSize,
        GameType,
        createGameRandomItems,
        setDimensions,
        shuffleArray,
    } from "../constants";
    import { gameStore, updateGameStore } from "../store";
    import {
        handleClickGameElement,
        hideGameElementsVisibility,
        resetLastTwoMoves,
    } from "../utils";

    export let app: Application;

    let gridContainer;
    let gameBoardBg: Graphics;
    let newGameElements = [];

    let icons;

    const createGame = () => {
        console.log("hi mounted");

        icons = shuffleArray(svgIconsArr);
        createGrid(
            $gameStore.gridSize,
            app.renderer.width,
            $gameStore.gridType
        );
    };
    onMount(() => {
        createGame();

        const appWidth = $gameStore.playerNum === EPlayerNum.One ? 654 : 654;
        const appHeight = $gameStore.playerNum === EPlayerNum.One ? 733 : 650;
        console.log("updateSolo", $gameStore.playerNum === EPlayerNum.One);
        app?.renderer.resize(appWidth, appHeight);
    });

    async function destroyElements() {
        console.log("start destroying");

        await new Promise((res) => {
            newGameElements = newGameElements.map((row, i) => {
                if (row?.length) {
                    console.log(row);
                    row.filter((cols) => {
                        console.log(cols);
                        cols.circle?.destroy();
                        cols.innerElement?.destroy();
                        return false;
                    });
                    if (i === $gameStore.gridSize - 1) {
                        res("done");
                        console.log("done destroying");
                    }
                }
            });

            newGameElements = newGameElements.filter((row) => {
                if (!row) return false;
            });
        });
    }
    let creatingGrid = false;
    let timeout2Games;
    const unsubGameStore = gameStore.subscribe(async (currStore) => {
        // if (currStore.timeElapsed === "0:00") {

        if (currStore.gameElements.length === 0 && !creatingGrid) {
            await destroyElements();
            console.log("destroyed grid on subscribe");
            createGame();
            // destroyElements();
            // await destroyElements();
        } else {
        }
        if (currStore.lastTwoMoves.length === 2) {
            // createGame();
            timeout2Games = setTimeout(() => {
                console.log(" currStore.lastTwoMoves", currStore.lastTwoMoves);
                if (
                    currStore.lastTwoMoves.length &&
                    currStore.lastTwoMoves[0].value !==
                        currStore.lastTwoMoves[1].value
                ) {
                    hideGameElementsVisibility(currStore.lastTwoMoves);

                    // clearTimeout(timeout2Games);
                }
                resetLastTwoMoves(0);
            }, 1500);
        } else if (currStore.lastTwoMoves.length === 0) {
            if (timeout2Games) clearTimeout(timeout2Games);
        }
    });

    onDestroy(async () => {
        await destroyElements();
        if (app && gridContainer) {
            app.stage?.removeChild(gameBoardBg, gridContainer);
        }
        unsubGameStore();
    });

    const gameBoardP = $gameStore.gridSize === 6 ? 10 : 30;
    const gameCircleDiameter = $gameStore.gridSize === 6 ? 82 : 118;
    const gameCircleGaps = $gameStore.gridSize === 6 ? 16 : 20;
    function createGrid(
        rows: GameSize,
        containerWidth,
        iconGrid: GameType,
        columns = rows
    ) {
        creatingGrid = true;
        const gap = 10;
        // let circleDiameter = containerWidth / rows - gap - gap / rows;
        let circleRadius = gameCircleDiameter / 2;

        const gridSize = Math.pow(rows, 2);
        console.log("gridSize", gridSize, icons.length);
        if (gridSize / 2 >= icons.length) {
            console.error("Grid size larger than available icons");
            return;
        }
        const gameElements = createGameRandomItems(gridSize);

        console.log(
            containerWidth,
            "circleRadius",
            circleRadius,
            circleRadius / 1.7
        );

        gridContainer = new Container();
        gameBoardBg = new Graphics();
        gameBoardBg.beginFill(0xfcfcfc);
        gameBoardBg.drawRect(0, 0, 592, 592);
        gameBoardBg.endFill();

        gridContainer.position.set(
            app.screen.width / 2 - gameBoardBg.width / 2,
            0
        );

        let currentCircle = 0;

        const renderTexture = RenderTexture.create({
            width: app.screen.width / 2,
            height: app.screen.height,
        });

        //    renderTextureSprite.filters = [new PIXI.filters.FXAAFilter()];
        // renderTextureSprite.filters = [new PIXI.filters.MSAAFilter()];

        // app.stage.addChild(renderTextureSprite);

        gridContainer.addChild(gameBoardBg);

        for (let i = 0; i < rows; i++) {
            const rowsArr = [];
            for (let j = 0; j < columns; j++) {
                const circle = new Graphics();
                const currGameElement = gameElements[currentCircle];
                const elementColor = 0xfda214;
                // const elementColor = currGameElement.iconColor;

                circle.beginFill(elementColor);
                // circle.beginFill(0xffffc9);
                // circle.beginFill(0x304859);
                circle.drawCircle(0, 0, circleRadius);
                circle.endFill();

                const startPos = gameCircleDiameter / 2 + gameBoardP;
                const x = i * (gameCircleDiameter + gameCircleGaps) + startPos;
                const y = j * (gameCircleDiameter + gameCircleGaps) + startPos;
                // const y = circleDiameter / 2.4;
                // const y = i * (circleDiameter + gap) + circleRadius + gap;
                // const x = j * (circleDiameter + gap) + circleRadius + gap;
                // const y = i * (circleDiameter + gap) + circleRadius + gap;
                console.log({
                    gameCircleGaps,
                    gameCircleDiameter,
                });
                circle.position.set(x, y);

                circle.interactive = true;
                circle.cursor = "pointer";
                // console.log("currentCircle", currentCircle);
                let circleShape;
                let circleNumber;

                let element;
                if (iconGrid) {
                    circleShape = Sprite.from(
                        Assets.get(icons[currGameElement.value])
                    );
                    element = circleShape;
                    // icon.width = 30;
                    // icon.height = 30;

                    setDimensions(null, circleRadius / 1.5, circleShape);

                    circleShape.anchor.set(0.5);
                    circleShape.position.set(x, y);
                    // icon.tint = 0xfff000;

                    // Apply the filter to the sprite

                    // icon.tint = elementColor;
                } else {
                    circleNumber = new Text(currGameElement.value, {
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
                    // circle.beginFill(isOpen ? 0xfda214 : 0x304859);
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
                              : //   ? 0xfda214
                                0x304859
                    );
                    circle.drawCircle(0, 0, circleRadius);
                    circle.endFill();
                };

                element.visible = false;
                setOpenState(element.visible);

                currGameElement.isVisible = element.visible;
                circle.on("mousedown", () => {
                    console.log(
                        "clicked on:",
                        i,
                        j,
                        "currentCircle:",
                        currentCircle
                    );

                    handleClickGameElement(i, j);

                    // updateGameStore((state) => {
                    //     state.movesTotal += 1;
                    //     state.gameElements[i][j].isVisible = !element.visible;
                    //     return state;
                    // });
                    // element.visible = !element.visible;
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
                    gridContainer.addChild(circleShape);
                } else {
                    gridContainer.addChild(circleNumber);
                }

                // gridContainer.cacheAsBitmap = true;
                // gridContainer.scale.set(0.5);
                const newObj = {
                    position: { row: i, column: j },
                    value: null,
                    circle,
                    circleRadius,
                    innerElement: element,
                    ...currGameElement,
                };
                rowsArr.push(newObj);
            }
            newGameElements.push(rowsArr);
        }
        updateGameStore((state) => {
            state.gameElements = newGameElements;
            return state;
        });
        console.log(newGameElements, $gameStore.gameElements);
        creatingGrid = false;
        console.log("done creating grid");
        app.stage.addChild(gridContainer);
    }
</script>
