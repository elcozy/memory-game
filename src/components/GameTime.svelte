<script lang="ts">
    import { Application, Container, Graphics, Text } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { gameStore, updateGameStore, updateToGameStore } from "../store";

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
    let seconds = 0;
    let interval;

    const startTimer = () => {
        interval = setInterval(() => {
            seconds += 1;

            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            const formattedTime =
                remainingSeconds < 10
                    ? `${minutes}:0${remainingSeconds}`
                    : `${minutes}:${remainingSeconds}`;

            updateToGameStore("timeElapsed", formattedTime);
        }, 1000);
    };

    const cardsP = 30;
    onMount(() => {
        movesContainer = new Container();

        startTimer();
        const time = createTime();

        const moves = createMoves();

        movesContainer.addChild(time, moves);

        time.position.set(0);
        moves.position.set(time.width + cardsP, 0);
        movesContainer.position.set(
            app.renderer.width / 2 - movesContainer.width / 2,
            app.renderer.height - movesContainer.height
        );

        app.stage.addChild(movesContainer);
    });

    let lastTimeElapsed = null;
    let lastMoves = null;

    const unsubGameStore = gameStore.subscribe((currStore) => {
        if (seconds && currStore.timeElapsed === "0:00") {
            seconds = 0;
            clearInterval(interval);
            startTimer();
        }
        if (currStore.timeElapsed !== lastTimeElapsed) {
            lastTimeElapsed = currStore.timeElapsed;

            if (timeSpentPixi) {
                timeSpentPixi.text = lastTimeElapsed;
                timeSpentPixi.position.set(
                    timeBg.width - padding - timeSpentPixi.width,
                    timeBg.height / 2 - timeSpentPixi.height / 2
                );
            }
        }

        if (currStore.movesTotal !== lastMoves) {
            console.log("X game", currStore);
            lastMoves = currStore.movesTotal;

            if (movesPixi) {
                movesPixi.text = currStore.movesTotal;
                movesPixi.position.set(
                    movesBg.width - padding - movesPixi.width,
                    movesBg.height / 2 - movesPixi.height / 2
                );
            }
        }
    });

    onDestroy(() => {
        clearInterval(interval);
        unsubGameStore();
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
            fontSize: 18,
        });

        timeSpentPixi = new Text($gameStore.timeElapsed, {
            fontSize: 24,
            fontWeight: "bolder",
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
