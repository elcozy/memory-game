<script lang="ts">
    import { Application, Container, Graphics, Text } from "pixi.js";
    import { onDestroy, onMount } from "svelte";

    import { EPlayerNum, GameSize, GameType } from "../types";
    import {
        gameStore,
        subscribeGameStore,
        timeSpent,
        updateToGameStore,
    } from "../store";
    import {
        animateModal,
        clearTimer,
        createGridz,
        createModalSummary,
        destroyGameBoard,
        resetLastTwoMoves,
        updateGameElementsVisibility,
    } from "../utils";

    export let app: Application;

    const createGame = () => {
        createGrid(
            $gameStore.gridSize,
            app.renderer.width,
            $gameStore.gridType
        );

        const appWidth = $gameStore.playerNum === EPlayerNum.One ? 654 : 654;
        const appHeight = $gameStore.playerNum === EPlayerNum.One ? 733 : 650;
        app?.renderer.resize(appWidth, appHeight);
    };

    const createSummary = () => {
        const summary = createModalSummary($timeSpent, $gameStore.movesTotal);

        summary.pivot.set(summary.width / 2, summary.height / 2);
        summary.position.set(
            summary.width / 2,
            screen.height / 2 + (app.screen.height - screen.height) / 2
        );

        animateModal(summary);
        updateToGameStore("summaryPixi", summary);

        if (app?.stage) app.stage.addChild(summary);
    };
    onMount(() => {
        createGame();
    });

    let creatingGrid = false;
    let timeout2Games;

    subscribeGameStore("elementsFound", async (currElementsFound) => {
        const gameElementsLen = Math.pow($gameStore.gameElements.length, 2);
        console.log("Found el", currElementsFound, "out of", gameElementsLen);

        if (currElementsFound === gameElementsLen) {
            console.log("GAME FINISHED");
            clearTimer();
            createSummary();
        }
    });
    subscribeGameStore("gameElements", async (currGameElement) => {
        console.log("currGameElement", currGameElement);

        if (currGameElement.length === 0 && !creatingGrid) {
            await destroyGameBoard();
            console.log("destroyed grid on subscribe");
        } else {
        }
    });
    subscribeGameStore("lastTwoMoves", async (currLastTwoMoves) => {
        console.log("currLastTwoMoves", currLastTwoMoves);

        if (currLastTwoMoves.length === 1) {
            updateToGameStore("movesTotal", $gameStore.movesTotal + 1);
        }
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
        await destroyGameBoard();
    });

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
