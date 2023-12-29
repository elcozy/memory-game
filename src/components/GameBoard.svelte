<script lang="ts">
    import { Application, Graphics } from "pixi.js";
    import { onDestroy, onMount } from "svelte";

    import { EPlayerNum, GameSize, GameType } from "../types";
    import { gameStore, subscribeGameStore } from "../store";
    import {
        createGridz,
        destroyGameElements,
        handleClickGameElement,
        resetLastTwoMoves,
        updateGameElementsVisibility,
    } from "../utils";

    export let app: Application;

    let gridContainer;
    let gameBoardBg: Graphics;

    const createGame = () => {
        console.log("hi mounted");

        createGrid(
            $gameStore.gridSize,
            app.renderer.width,
            $gameStore.gridType
        );

        const appWidth = $gameStore.playerNum === EPlayerNum.One ? 654 : 654;
        const appHeight = $gameStore.playerNum === EPlayerNum.One ? 733 : 650;
        app?.renderer.resize(appWidth, appHeight);
    };
    onMount(() => {
        createGame();
    });

    async function destroyElements() {
        await destroyGameElements().then(() => {
            if (app && gridContainer) {
                app.stage?.removeChild(gameBoardBg, gridContainer);
            }
        });
    }

    let creatingGrid = false;
    let timeout2Games;

    subscribeGameStore("elementsFound", async (currElementsFound) => {
        const gameElementsLen = Math.pow($gameStore.gameElements.length, 2);
        console.log(
            "currElementsFound",
            currElementsFound,
            "--",
            gameElementsLen
        );
        if (currElementsFound === gameElementsLen) {
            console.log("GAME FINISHED");
        }
    });
    subscribeGameStore("gameElements", async (currGameElement) => {
        console.log("currGameElement", currGameElement);

        if (currGameElement.length === 0 && !creatingGrid) {
            await destroyElements();
            console.log("destroyed grid on subscribe");
            // createGame();
            // destroyElements();
            // await destroyElements();
        } else {
        }
    });
    subscribeGameStore("lastTwoMoves", async (currLastTwoMoves) => {
        console.log("currLastTwoMoves", currLastTwoMoves);

        if (currLastTwoMoves.length === 2) {
            // createGame();

            const timeoutTime =
                currLastTwoMoves[0].value === currLastTwoMoves[1].value
                    ? 400
                    : 1400;

            timeout2Games = setTimeout(async () => {
                await updateGameElementsVisibility(
                    currLastTwoMoves,
                    currLastTwoMoves[0].value === currLastTwoMoves[1].value
                ).then(() => resetLastTwoMoves(0));

                console.log(" currLastTwoMoves", currLastTwoMoves);
            }, timeoutTime);
        } else if (currLastTwoMoves.length === 0) {
            if (timeout2Games) clearTimeout(timeout2Games);
        }
    });

    onDestroy(async () => {
        await destroyElements();
    });

    const gameBoardP = $gameStore.gridSize === 6 ? 10 : 30;
    const gameCircleDiameter = $gameStore.gridSize === 6 ? 82 : 118;
    const gameCircleGaps = $gameStore.gridSize === 6 ? 16 : 20;

    async function createGrid(
        rows: GameSize,
        containerWidth,
        iconGrid: GameType
    ) {
        await createGridz({
            appWidth: app.screen.width,
            appHeight: app.screen.height,
            rows,
            containerWidth,
            iconGrid,
        }).then((res) => {
            console.log("res", res);
            if (app?.stage) app.stage.addChild(res);
        });
    }
</script>
