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
    import { centerItem, restartGame, setDimensions } from "../constants";

    export let app: Application;

    let mainScreenContainer;

    let selectThemeTextPixi: Text;
    let numOfPlayersTextPixi: Text;
    let gridSizeTextPixi: Text;
    let themeNumTextPixi: Text;
    let themeIconsTextPixi: Text;
    let grid4TextPixi: Text;
    let grid6TextPixi: Text;
    let startGameTextPixi: Text;
    let startGameBtn: Graphics;

    const padding = 15;
    const cardPadding = 20;
    const cardGap = 15;

    const containerWidth = 600;
    const containerHeight = 800;

    onMount(() => {
        mainScreenContainer = new Container();

        const themeContainer = createTheme();
        themeContainer.position.set(0);

        const gridContainer = createGrid();
        gridContainer.position.set(
            0,
            themeContainer.y + themeContainer.height + padding
        );

        const startBtnContainer = createStartBtn();
        startBtnContainer.position.set(
            0,
            gridContainer.y + gridContainer.height + padding + 50
        );
        // gridContainer.position.set(10, 100);

        app.stage.addChild(mainScreenContainer);
    });

    afterUpdate(() => {});

    onDestroy(() => {
        if (app) {
            if (mainScreenContainer)
                app.stage?.removeChild(mainScreenContainer);
        }
    });

    function createTheme() {
        const themeContainer = new Container();

        const cardPadding = 20;
        const cardGap = 15;

        const themeBtnW = containerWidth / 2;
        const themeBtnR = 30;
        const themeBtnH = 50;

        selectThemeTextPixi = new Text("Select Theme", {
            fontSize: 24,
            // fontWeight: "bold",
        });
        themeNumTextPixi = new Text("Numbers", {
            fontSize: 18,
            // fontWeight: "bold",
        });
        themeIconsTextPixi = new Text("Icons", {
            fontSize: 18,
            // fontWeight: "bold",
        });

        const themeNumBtn = new Graphics();
        const themeIconsBtn = new Graphics();

        themeNumBtn.beginFill(0xdfe7ec);
        themeNumBtn.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
        themeNumBtn.endFill();
        themeNumBtn.interactive = true;
        themeNumBtn.cursor = "pointer";
        themeNumBtn.on("mousedown", () => {
            console.log("selected theme number");
        });

        themeIconsBtn.beginFill(0xdfe7ec);
        themeIconsBtn.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
        themeIconsBtn.endFill();
        themeIconsBtn.interactive = true;
        themeIconsBtn.cursor = "pointer";
        themeIconsBtn.on("mousedown", () => {
            console.log("New themeIconsBtn");
        });

        mainScreenContainer.position.set(10);
        selectThemeTextPixi.position.set(cardPadding);

        themeNumBtn.position.set(
            cardPadding,
            selectThemeTextPixi.y + selectThemeTextPixi.height + cardGap
        );
        themeIconsBtn.position.set(
            2 * cardPadding + themeNumBtn.width,
            selectThemeTextPixi.y + selectThemeTextPixi.height + cardGap
        );

        centerItem(themeNumTextPixi, themeNumBtn);
        centerItem(themeIconsTextPixi, themeIconsBtn);

        themeContainer.addChild(
            themeIconsBtn,
            selectThemeTextPixi,
            themeNumBtn,
            themeNumTextPixi,
            themeIconsTextPixi
        );

        mainScreenContainer.addChild(themeContainer);
        return themeContainer;
    }

    function createGrid() {
        const gridContainer = new Container();

        const themeBtnW = 250;
        const themeBtnR = 30;
        const themeBtnH = 50;

        gridSizeTextPixi = new Text("Grid Size", {
            fontSize: 24,
            // fontWeight: "bold",
        });
        grid4TextPixi = new Text("4", {
            fontSize: 18,
            // fontWeight: "bold",
        });
        grid6TextPixi = new Text("6", {
            fontSize: 18,
            // fontWeight: "bold",
        });

        const themeNumBtn = new Graphics();
        const themeIconsBtn = new Graphics();

        themeNumBtn.beginFill(0xdfe7ec);
        themeNumBtn.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
        themeNumBtn.endFill();
        themeNumBtn.interactive = true;
        themeNumBtn.cursor = "pointer";
        themeNumBtn.on("mousedown", () => {
            console.log("selected theme number");
        });

        themeIconsBtn.beginFill(0xdfe7ec);
        themeIconsBtn.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
        themeIconsBtn.endFill();
        themeIconsBtn.interactive = true;
        themeIconsBtn.cursor = "pointer";
        themeIconsBtn.on("mousedown", () => {
            console.log("New themeIconsBtn");
        });

        gridSizeTextPixi.position.set(cardPadding);

        themeNumBtn.position.set(
            cardPadding,
            gridSizeTextPixi.y + gridSizeTextPixi.height + cardGap
        );
        themeIconsBtn.position.set(
            2 * cardPadding + themeNumBtn.width,
            gridSizeTextPixi.y + gridSizeTextPixi.height + cardGap
        );

        centerItem(grid4TextPixi, themeNumBtn);
        centerItem(grid6TextPixi, themeIconsBtn);

        gridContainer.addChild(
            themeIconsBtn,
            gridSizeTextPixi,
            themeNumBtn,
            grid4TextPixi,
            grid6TextPixi
        );

        mainScreenContainer.addChild(gridContainer);
        return gridContainer;
    }

    function createStartBtn() {
        const startBtnContainer = new Container();

        const startBtnW = 520;
        const startBtnR = 30;
        const startBtnH = 50;

        startGameTextPixi = new Text("Start Game", {
            fontSize: 25,
        });
        startGameBtn = new Graphics();

        startGameBtn.beginFill(0xdfe7ec);
        startGameBtn.drawRoundedRect(0, 0, startBtnW, startBtnH, startBtnR);
        startGameBtn.endFill();
        startGameBtn.interactive = true;
        startGameBtn.cursor = "pointer";
        startGameBtn.on("mousedown", () => {
            console.log("Start game");
        });

        startGameBtn.position.set(cardPadding, 0);
        centerItem(startGameTextPixi, startGameBtn);
        startBtnContainer.addChild(startGameBtn, startGameTextPixi);

        mainScreenContainer.addChild(startBtnContainer);

        return startBtnContainer;
    }
</script>
