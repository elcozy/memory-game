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
    import { updateGameStore } from "../store";
    import {
        EPlayerNum,
        GameSize,
        GameType,
        restartGame,
        setDimensions,
    } from "../constants";

    export let app: Application;

    let movesContainer;

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

    function createTime() {
        movesContainer = new Container();
        const appWidth = app.renderer.width;
        const appHeight = app.renderer.height;

        const timeBgWidth = 250;
        const timeBgHeight = 67;

        let restartBg = new Graphics();

        restartBg.beginFill(0xfda214);
        restartBg.drawRoundedRect(0, 0, timeBgWidth / 2, timeBgHeight, padding);
        restartBg.endFill();
        restartBg.interactive = true;
        restartBg.cursor = "pointer";
        restartBg.on("mousedown", () => {
            restartGame();
        });

        let newGameBg = new Graphics();

        newGameBg.beginFill(0xdfe7ec);
        newGameBg.drawRoundedRect(0, 0, timeBgWidth / 2, timeBgHeight, padding);
        newGameBg.endFill();
        newGameBg.interactive = true;
        newGameBg.cursor = "pointer";
        newGameBg.on("mousedown", () => {
            console.log("New Game");
            updateGameStore((state) => {
                state.screen = "main";
                state.gridType = GameType.SvgIconsArr;
                state.gridSize = GameSize.Four;
                state.playerNum = EPlayerNum.One;

                return state;
            });
        });

        const tileIcon = Sprite.from(Assets.get("Title"));

        setDimensions(null, 25, tileIcon);

        const restartTextPixi = new Text("Restart", {
            fontSize: 18,
            fontWeight: "bold",
        });
        const newGameTextPixi = new Text("New Game", {
            fontSize: 18,
            fontWeight: "bold",
        });

        tileIcon.position.set(0, timeBgHeight / 2 - tileIcon.height / 2);
        movesContainer.position.set(10);
        restartBg.position.set(appWidth - timeBgWidth - padding - 20, 0);
        newGameBg.position.set(appWidth - timeBgWidth / 2 - 20, 0);

        restartTextPixi.position.set(
            restartBg.x + restartBg.width / 2 - restartTextPixi.width / 2,
            restartBg.y + restartBg.height / 2 - restartTextPixi.height / 2
        );
        newGameTextPixi.position.set(
            newGameBg.x + newGameBg.width / 2 - newGameTextPixi.width / 2,
            newGameBg.y + newGameBg.height / 2 - newGameTextPixi.height / 2
        );

        movesContainer.addChild(
            tileIcon,
            newGameBg,
            restartBg,
            restartTextPixi,
            newGameTextPixi
        );

        app.stage.addChild(movesContainer);
    }
</script>
