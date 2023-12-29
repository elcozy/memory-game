<script lang="ts">
    import { Application, Container, Graphics, Text } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import {
        gameStore,
        subscribeGameStore,
        timeElapsed,
        timeInterval,
        timeSpent,
        updateGameStore,
        updateToGameStore,
    } from "../store";
    import { get } from "svelte/store";
    import { clearTimer, startTimer } from "../utils";

    export let app: Application;

    let movesContainer;
    let timeSpentPixi;
    let timeBg;
    let movesBg;
    let movesPixi;

    const padding = 15;
    const timeBgWidth = 255;
    const timeBgHeight = 72;

    afterUpdate(() => {});

    onDestroy(() => {
        if (app) {
            if (movesContainer) app.stage?.removeChild(movesContainer);
        }
    });

    const setTime = (time: string) => {
        if (timeSpentPixi) {
            // console.log("timeElapsed", time);
            timeSpentPixi.text = time ?? "0:00";
            timeSpentPixi.position.set(
                timeBg.width - padding - timeSpentPixi.width,
                timeBg.height / 2 - timeSpentPixi.height / 2
            );
        }
    };
    const setMoves = (moves: number) => {
        if (movesPixi) {
            movesPixi.text = moves;
            movesPixi.position.set(
                movesBg.width - padding - movesPixi.width,
                movesBg.height / 2 - movesPixi.height / 2
            );
        }
    };

    const cardsP = 30;
    onMount(() => {
        movesContainer = new Container();

        const time = createTime();

        const moves = createMoves();

        movesContainer.addChild(time, moves);

        time.position.set(0);
        moves.position.set(time.width + cardsP, 0);
        movesContainer.position.set(
            app.renderer.width / 2 - movesContainer.width / 2,
            app.renderer.height - movesContainer.height
        );

        // timeSpent.start();
        startTimer();
        app.stage.addChild(movesContainer);
    });

    const unsubTimeSpent = timeSpent.subscribe((currTimeSpent) => {
        setTime(currTimeSpent);

        //
    });

    subscribeGameStore("movesTotal", (currMoveTotal) => {
        console.log("X game currMoveTotal", currMoveTotal);

        setMoves(currMoveTotal);
    });
    subscribeGameStore("elementsFound", async (currElementsFound) => {
        const gameElementsLen = Math.pow($gameStore.gameElements.length, 2);

        console.log("Found el", currElementsFound, "out of", gameElementsLen);
        if (currElementsFound === gameElementsLen) {
            clearTimer();
        }
    });
    onDestroy(() => {
        clearTimer();
        // unsubTimeElapsed();
        unsubTimeSpent();
    });
    function createTime() {
        const timeContainer = new Container();
        timeBg = new Graphics();

        timeBg.beginFill(0xdfe7ec);
        timeBg.drawRoundedRect(0, 0, timeBgWidth, timeBgHeight, padding);
        timeBg.endFill();

        const x = 0;
        const y = app.renderer.height - timeBgHeight;

        timeBg.interactive = true;
        timeBg.cursor = "pointer";

        const timeText = new Text("Time", {
            fontFamily: "AtkinsonHyperlegible Bold",

            fontSize: 18,
        });

        timeSpentPixi = new Text($gameStore.timeElapsed, {
            fontFamily: "AtkinsonHyperlegible Bold",

            fontSize: 24,
        });

        timeText.position.set(padding, timeBg.height / 2 - timeText.height / 2);
        timeSpentPixi.position.set(
            timeBg.width - padding - timeSpentPixi.width,
            timeBg.height / 2 - timeSpentPixi.height / 2
        );

        timeContainer.addChild(timeBg, timeText, timeSpentPixi);

        return timeContainer;
    }

    function createMoves() {
        const moveContainer = new Container();

        movesBg = new Graphics();

        movesBg.beginFill(0xdfe7ec);
        movesBg.drawRoundedRect(0, 0, timeBgWidth, timeBgHeight, padding);
        movesBg.endFill();

        const x = app.renderer.width - timeBgWidth;
        const y = app.renderer.height - timeBgHeight;

        movesBg.interactive = true;
        movesBg.cursor = "pointer";

        const movesTextPixi = new Text("Moves", {
            fontSize: 18,
        });
        movesPixi = new Text($gameStore.movesTotal, {
            fontSize: 24,
            fontWeight: "bolder",
        });

        movesTextPixi.position.set(
            padding,
            movesBg.height / 2 - movesTextPixi.height / 2
        );
        movesPixi.position.set(
            movesBg.width - padding - movesPixi.width,
            movesBg.height / 2 - movesPixi.height / 2
        );

        moveContainer.addChild(movesBg, movesTextPixi, movesPixi);

        return moveContainer;
    }
</script>
