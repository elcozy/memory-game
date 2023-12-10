<script lang="ts">
    import {
        Application,
        Assets,
        Container,
        Graphics,
        Sprite,
        Text,
    } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { svgIconsArr } from "../manifest";
    import {
        GameSize,
        GameType,
        createGameRandomItems,
        setDimensions,
        shuffleArray,
    } from "../constants";
    import { gameStore, updateGameStore } from "../store";

    export let app: Application;

    let gridContainer;
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
    });

    async function destroyElements() {
        console.log("start destroying");

        await new Promise((res) => {
            newGameElements = newGameElements.map((row, i) => {
                if (row?.length) {
                    row.filter((cols) => {
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

    const unsubGameStore = gameStore.subscribe(async (currStore) => {
        // if (currStore.timeElapsed === "0:00") {

        if (currStore.gameElements.length === 0 && !creatingGrid) {
            await destroyElements();
            console.log("destroyed grid on subscribe");
            createGame();
            // destroyElements();
            // await destroyElements();
        } else {
            // createGame();
        }
    });

    onDestroy(async () => {
        await destroyElements();
        unsubGameStore();
        if (app) {
            if (gridContainer) app.stage?.removeChild(gridContainer);
        }
    });

    function createGrid(
        rows: GameSize,
        containerWidth,
        iconGrid: GameType,
        columns = rows
    ) {
        creatingGrid = true;
        const gap = 10;
        let circleDiameter = containerWidth / rows - gap - gap / rows;
        let circleRadius = circleDiameter / 2;

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

        gridContainer.position.set(0, 67 + 15);

        let currentCircle = 0;

        for (let i = 0; i < rows; i++) {
            const rowsArr = [];
            for (let j = 0; j < columns; j++) {
                const circle = new Graphics();
                const currGameElement = gameElements[currentCircle];
                const elementColor = currGameElement.iconColor;

                circle.beginFill(elementColor);
                // circle.beginFill(0xffffc9);
                // circle.beginFill(0x304859);
                circle.drawCircle(0, 0, circleRadius);
                circle.endFill();

                const x = j * (circleDiameter + gap) + circleRadius + gap;
                const y = i * (circleDiameter + gap) + circleRadius + gap;

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

                    setDimensions(null, circleRadius / 1.7, circleShape);

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

                // element.visible = false;
                // setOpenState(element.visible);

                currGameElement.isVisible = element.visible;
                circle.on("mousedown", () => {
                    console.log(
                        "clicked on:",
                        i,
                        j,
                        "currentCircle:",
                        currentCircle
                    );

                    updateGameStore((state) => {
                        state.movesTotal += 1;
                        state.gameElements[i][j].isVisible = !element.visible;
                        return state;
                    });
                    element.visible = !element.visible;
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

                const newObj = {
                    position: { row: i, column: j },
                    value: null,
                    circle,
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
