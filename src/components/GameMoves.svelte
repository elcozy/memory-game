<script lang="ts">
    import { Application, Container, Graphics, Text } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { GameSize } from "../constants";
    import { tempMoves } from "../store";

    export let app: Application;

    let movesContainer;
    let movesPixi;
    onMount(() => {
        createMoves();
    });

    afterUpdate(() => {});

    onDestroy(() => {
        if (app) {
            if (movesContainer) app.stage?.removeChild(movesContainer);
        }
    });

    tempMoves.subscribe((currMoves) => {
        if (movesPixi) {
            movesPixi.text = currMoves;
        }
    });

    function createMoves() {
        movesContainer = new Container();

        const padding = 15;

        const timeBgWidth = 250;
        const timeBgHeight = 67;

        const timeBg = new Graphics();

        timeBg.beginFill(0xdfe7ec);
        timeBg.drawRoundedRect(0, 0, timeBgWidth, timeBgHeight, padding);
        timeBg.endFill();

        const x = 4 + 300;
        const y = app.renderer.height - timeBg.height;

        movesContainer.position.set(x, y);

        timeBg.interactive = true;
        timeBg.cursor = "pointer";

        const movesTextPixi = new Text("Moves", {
            fontSize: 18,
        });
        movesPixi = new Text($tempMoves, {
            fontSize: 24,
            fontWeight: "bolder",
        });

        movesTextPixi.position.set(
            padding,
            timeBg.height / 2 - movesTextPixi.height / 2
        );
        movesPixi.position.set(
            timeBg.width - padding - movesPixi.width,
            timeBg.height / 2 - movesPixi.height / 2
        );

        movesContainer.addChild(timeBg, movesTextPixi, movesPixi);

        app.stage.addChild(movesContainer);
    }
</script>
