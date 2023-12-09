<script lang="ts">
    import { Application, Container, Graphics, Text } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { gameStore, updateGameStore } from "../store";

    export let app: Application;

    let movesContainer;
    let timeSpentPixi;
    let timeBg;

    const padding = 15;

    onMount(() => {
        createTime();
    });

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

            updateGameStore((state) => {
                state.timeElapsed = formattedTime;
                return state;
            });
        }, 1000);
    };

    onMount(() => {
        startTimer();
    });

    let lastTimeElapsed = null;

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
    });

    onDestroy(() => {
        clearInterval(interval);
        unsubGameStore();
    });
    function createTime() {
        movesContainer = new Container();

        const timeBgWidth = 250;
        const timeBgHeight = 67;

        timeBg = new Graphics();

        timeBg.beginFill(0xdfe7ec);
        timeBg.drawRoundedRect(0, 0, timeBgWidth, timeBgHeight, padding);
        timeBg.endFill();

        const x = 0;
        const y = app.renderer.height - timeBgHeight;

        movesContainer.position.set(x + 10, y - 10);

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

        movesContainer.addChild(timeBg, timeText, timeSpentPixi);

        app.stage.addChild(movesContainer);
    }
</script>
