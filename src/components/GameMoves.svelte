<script lang="ts">
    import { Application, Container, Graphics, Text } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { GameSize } from "../constants";
    import { gameStore, updateGameStore } from "../store";

    export let app: Application;
    const padding = 15;
    let movesBg;

    let movesContainer;
    let movesPixi;
    onMount(() => {
        createMoves();
    });

    afterUpdate(() => {});

    let lastMoves = null;

    const unsubGameStore = gameStore.subscribe((currStore) => {
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
        if (app) {
            if (movesContainer) app.stage?.removeChild(movesContainer);
        }
        unsubGameStore();
    });
    function createMoves() {
        movesContainer = new Container();

        const movesBgWidth = 250;
        const movesBgHeight = 67;

        movesBg = new Graphics();

        movesBg.beginFill(0xdfe7ec);
        movesBg.drawRoundedRect(0, 0, movesBgWidth, movesBgHeight, padding);
        movesBg.endFill();

        const x = app.renderer.width - movesBgWidth;
        const y = app.renderer.height - movesBgHeight;

        movesContainer.position.set(x - 10, y - 10);

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

        movesContainer.addChild(movesBg, movesTextPixi, movesPixi);

        app.stage.addChild(movesContainer);
    }
</script>
