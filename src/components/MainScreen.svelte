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
    import { EPlayerNum, GameSize, GameType } from "../types";
    import { centerItem } from "../constants";
    import { gameStore, updateToGameStore } from "../store";
    import { Logger } from "../utils/index";

    export let app: Application;

    let mainScreenContainer: Container;
    let mainGameBg: Graphics;
    let memoryIcon: Sprite;

    let selectThemeTextPixi: Text;
    let numOfPlayersTextPixi: Text;
    let gridSizeTextPixi: Text;
    let themeNumTextPixi: Text;
    let themeIconsTextPixi: Text;
    let grid4TextPixi: Text;
    let grid6TextPixi: Text;
    let startGameTextPixi: Text;
    let startGameBtn: Graphics;
    let numOfPlayersBtns: { number?: { btn: Graphics; text: Text } };

    const btnTextProps: any = {
        fontSize: 26,
        fill: 0xffffff,
        fontFamily: "AtkinsonHyperlegible Bold",
    };

    const titleTextProps: any = {
        fontSize: 20,
        fill: 0x7191a5,
        fontFamily: "AtkinsonHyperlegible Bold",
    };
    const padding = 16;
    const cardPadding = 56;
    const cardGap = 16;
    const cardGapY = 32;
    const titleMarginB = 16;
    const cardBtnGapX = 30;

    const containerWidth = 654;
    const containerHeight = 800;

    const themeBtnW = containerWidth / 2 - cardBtnGapX / 2 - cardPadding;
    const themeBtnR = 26;
    const themeBtnH = 52;
    const mainGameBgR = 20;
    onMount(() => {
        mainScreenContainer = new Container();
        mainScreenContainer.position.set(cardPadding);

        mainGameBg = new Graphics();
        mainGameBg.beginFill(0xfcfcfc);
        mainGameBg.drawRoundedRect(0, 0, 654, 559, mainGameBgR);
        mainGameBg.endFill();

        mainGameBg.position.set(
            app.screen.width / 2 - mainGameBg.width / 2,
            app.screen.height - mainGameBg.height
        );
        mainScreenContainer.position.set(
            app.screen.width / 2 - mainGameBg.width / 2 + cardPadding,
            mainGameBg.y + cardPadding
        );
        memoryIcon = Sprite.from(Assets.get("Memory"));
        memoryIcon.scale.set(1.4);
        memoryIcon.position.set(app.screen.width / 2 - memoryIcon.width / 2, 0);
        const themeContainer = createTheme();
        themeContainer.position.set(0);

        const playersContainer = createPlayers();
        playersContainer.position.set(
            0,
            themeContainer.y + themeContainer.height + cardGapY
        );
        const gridContainer = createGrid();
        gridContainer.position.set(
            0,
            playersContainer.y + playersContainer.height + cardGapY
        );

        const startBtnContainer = createStartBtn();
        startBtnContainer.position.set(
            0,
            gridContainer.y + gridContainer.height + cardGapY
        );

        app.stage.addChild(mainGameBg, memoryIcon, mainScreenContainer);
    });

    afterUpdate(() => {});

    onDestroy(() => {
        if (app) {
            if (mainScreenContainer && mainGameBg)
                app.stage?.removeChild(
                    mainScreenContainer,
                    memoryIcon,
                    mainGameBg
                );
        }
    });

    function createTheme() {
        const themeContainer = new Container();

        selectThemeTextPixi = new Text("Select Theme", titleTextProps);
        themeNumTextPixi = new Text("Numbers", { ...btnTextProps });
        themeIconsTextPixi = new Text("Icons", { ...btnTextProps });

        const themeNumBtn = new Graphics();
        const themeIconsBtn = new Graphics();
        const activeBtnColor = 0x304859;
        const normalBtnColor = 0xbcced9;
        const hoverBtnColor = 0x6395b8;

        themeNumBtn.beginFill(
            $gameStore.gridType === GameType.Numbers
                ? activeBtnColor
                : normalBtnColor
        );
        themeNumBtn.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
        themeNumBtn.endFill();
        themeNumBtn.interactive = true;
        themeNumBtn.cursor = "pointer";
        themeNumBtn.on("pointerdown", () => {
            Logger.log("selected theme number");
        });

        themeIconsBtn.beginFill(
            $gameStore.gridType === GameType.SvgIconsArr
                ? activeBtnColor
                : normalBtnColor
        );
        themeIconsBtn.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
        themeIconsBtn.endFill();
        themeIconsBtn.interactive = true;
        themeIconsBtn.cursor = "pointer";
        themeIconsBtn.on("pointerdown", () => {
            Logger.log("New themeIconsBtn");
        });

        const setBtnState = (element, color = normalBtnColor) => {
            element.clear();
            element.beginFill(color);
            // element.beginFill(isOver ? hoverBtnColor : normalBtnColor);
            element.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
            element.endFill();
        };

        themeNumBtn.on("pointerover", () => {
            if ($gameStore.gridType === GameType.Numbers) return;
            setBtnState(themeNumBtn, hoverBtnColor);
        });

        themeNumBtn.on("pointerout", () => {
            if ($gameStore.gridType === GameType.Numbers) return;

            setBtnState(themeNumBtn, normalBtnColor);
        });
        themeNumBtn.on("pointerdown", () => {
            updateToGameStore("gridType", GameType.Numbers);

            setBtnState(themeNumBtn, activeBtnColor);
            setBtnState(themeIconsBtn, normalBtnColor);
        });
        themeIconsBtn.on("pointerdown", () => {
            updateToGameStore("gridType", GameType.SvgIconsArr);

            setBtnState(themeIconsBtn, activeBtnColor);
            setBtnState(themeNumBtn, normalBtnColor);
        });
        themeIconsBtn.on("pointerover", () => {
            if ($gameStore.gridType === GameType.SvgIconsArr) return;

            setBtnState(themeIconsBtn, hoverBtnColor);
        });

        themeIconsBtn.on("pointerout", () => {
            if ($gameStore.gridType === GameType.SvgIconsArr) return;

            setBtnState(themeIconsBtn, normalBtnColor);
        });

        selectThemeTextPixi.position.set(0);

        themeNumBtn.position.set(
            0,
            selectThemeTextPixi.y + selectThemeTextPixi.height + titleMarginB
        );
        themeIconsBtn.position.set(
            cardBtnGapX + themeNumBtn.width,
            selectThemeTextPixi.y + selectThemeTextPixi.height + titleMarginB
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
    function createPlayers() {
        const gridContainer = new Container();
        const playersNoArr = [
            EPlayerNum.One,
            EPlayerNum.Two,
            EPlayerNum.Three,
            EPlayerNum.Four,
        ];
        numOfPlayersBtns = {};
        // Logger.log(playersNoArr.length);
        const numOfPlayersBtnsW =
            containerWidth / playersNoArr.length -
            (cardPadding / playersNoArr.length) * 2 +
            cardGap / playersNoArr.length -
            cardGap;

        numOfPlayersTextPixi = new Text("Number of Players", titleTextProps);

        numOfPlayersTextPixi.position.set(0);

        gridContainer.addChild(numOfPlayersTextPixi);
        const activeBtnColor = 0x304859;
        const normalBtnColor = 0xbcced9;
        const hoverBtnColor = 0x6395b8;

        const setBtnState = (element, color = normalBtnColor) => {
            element.clear();
            element.beginFill(color);
            element.drawRoundedRect(
                0,
                0,
                numOfPlayersBtnsW,
                themeBtnH,
                themeBtnR
            );
            element.endFill();
        };

        const updatePlayerBtnStates = (currSelected) => {
            playersNoArr.map((playerNum, i) => {
                setBtnState(
                    numOfPlayersBtns[i].btn,
                    playerNum === currSelected ? activeBtnColor : normalBtnColor
                );
            });
        };

        playersNoArr.map((playerNum, i) => {
            const btn = new Graphics();
            const text = new Text(playerNum + 1, { ...btnTextProps });
            btn.beginFill(
                $gameStore.playerNum === playerNum
                    ? activeBtnColor
                    : normalBtnColor
            );
            btn.drawRoundedRect(0, 0, numOfPlayersBtnsW, themeBtnH, themeBtnR);
            btn.endFill();
            if (playerNum === 0) {
                btn.interactive = true;
                btn.cursor = "pointer";
            } else {
                btn.interactive = true;
                btn.cursor = "not-allowed";
            }

            btn.on("pointerover", () => {
                if ($gameStore.playerNum === playerNum) return;
                setBtnState(btn, hoverBtnColor);
            });

            btn.on("pointerout", () => {
                if ($gameStore.playerNum === playerNum) return;

                setBtnState(btn, normalBtnColor);
            });

            btn.on("pointerdown", () => {
                if (playerNum !== 0) return;
                updateToGameStore("playerNum", playerNum);
                updatePlayerBtnStates(playerNum);
            });

            btn.position.set(
                i * (numOfPlayersBtnsW + cardGap),
                numOfPlayersTextPixi.y +
                    numOfPlayersTextPixi.height +
                    titleMarginB
            );

            centerItem(text, btn);

            gridContainer.addChild(btn, text);
            numOfPlayersBtns[playerNum] = { btn, text };
        });

        mainScreenContainer.addChild(gridContainer);
        return gridContainer;
    }

    function createGrid() {
        const gridContainer = new Container();

        gridSizeTextPixi = new Text("Grid Size", titleTextProps);
        grid4TextPixi = new Text("4x4", { ...btnTextProps });
        grid6TextPixi = new Text("6x6", { ...btnTextProps });

        const grid4Btn = new Graphics();
        const grid6Btn = new Graphics();
        const activeBtnColor = 0x304859;
        const normalBtnColor = 0xbcced9;
        const hoverBtnColor = 0x6395b8;

        grid4Btn.beginFill(
            $gameStore.gridSize === GameSize.Four
                ? activeBtnColor
                : normalBtnColor
        );
        grid4Btn.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
        grid4Btn.endFill();
        grid4Btn.interactive = true;
        grid4Btn.cursor = "pointer";
        grid4Btn.on("pointerdown", () => {
            Logger.log(4);
        });

        grid6Btn.beginFill(
            $gameStore.gridSize === GameSize.Six
                ? activeBtnColor
                : normalBtnColor
        );
        grid6Btn.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
        grid6Btn.endFill();
        grid6Btn.interactive = true;
        grid6Btn.cursor = "pointer";
        grid6Btn.on("pointerdown", () => {
            Logger.log(6);
        });

        const setBtnState = (element, color = normalBtnColor) => {
            element.clear();
            element.beginFill(color);
            // element.beginFill(isOver ? hoverBtnColor : normalBtnColor);
            element.drawRoundedRect(0, 0, themeBtnW, themeBtnH, themeBtnR);
            element.endFill();
        };

        grid4Btn.on("pointerover", () => {
            if ($gameStore.gridSize === GameSize.Four) return;
            setBtnState(grid4Btn, hoverBtnColor);
        });

        grid4Btn.on("pointerout", () => {
            if ($gameStore.gridSize === GameSize.Four) return;

            setBtnState(grid4Btn, normalBtnColor);
        });
        grid4Btn.on("pointerdown", () => {
            updateToGameStore("gridSize", GameSize.Four);
            setBtnState(grid4Btn, activeBtnColor);
            setBtnState(grid6Btn, normalBtnColor);
        });
        grid6Btn.on("pointerdown", () => {
            updateToGameStore("gridSize", GameSize.Six);
            setBtnState(grid6Btn, activeBtnColor);
            setBtnState(grid4Btn, normalBtnColor);
        });
        grid6Btn.on("pointerover", () => {
            if ($gameStore.gridSize === GameSize.Six) return;

            setBtnState(grid6Btn, hoverBtnColor);
        });

        grid6Btn.on("pointerout", () => {
            if ($gameStore.gridSize === GameSize.Six) return;

            setBtnState(grid6Btn, normalBtnColor);
        });

        gridSizeTextPixi.position.set(0);

        grid4Btn.position.set(
            0,
            gridSizeTextPixi.y + gridSizeTextPixi.height + titleMarginB
        );
        grid6Btn.position.set(
            cardBtnGapX + grid4Btn.width,
            gridSizeTextPixi.y + gridSizeTextPixi.height + titleMarginB
        );

        centerItem(grid4TextPixi, grid4Btn);
        centerItem(grid6TextPixi, grid6Btn);

        gridContainer.addChild(
            grid6Btn,
            gridSizeTextPixi,
            grid4Btn,
            grid4TextPixi,
            grid6TextPixi
        );

        mainScreenContainer.addChild(gridContainer);
        return gridContainer;
    }

    function createStartBtn() {
        const startBtnContainer = new Container();

        const startBtnW = containerWidth - 2 * cardPadding;
        const startBtnR = 35;
        const startBtnH = 70;

        startGameTextPixi = new Text("Start Game", {
            ...btnTextProps,
            fontSize: 32,
        });
        startGameBtn = new Graphics();

        startGameBtn.beginFill(0xfda214);
        startGameBtn.drawRoundedRect(0, 0, startBtnW, startBtnH, startBtnR);
        startGameBtn.endFill();
        startGameBtn.interactive = true;
        startGameBtn.cursor = "pointer";
        startGameBtn.on("pointerdown", () => {
            Logger.log("Start game");
            updateToGameStore("screen", "game");
        });

        const setHoverState = (isOver = true) => {
            startGameBtn.clear();
            startGameBtn.beginFill(isOver ? 0xffb84a : 0xfda214);
            startGameBtn.drawRoundedRect(0, 0, startBtnW, startBtnH, startBtnR);
            startGameBtn.endFill();
        };

        startGameBtn.on("pointerover", () => {
            setHoverState(true);
        });

        startGameBtn.on("pointerout", () => {
            setHoverState(false);
        });

        startGameBtn.position.set(0);
        centerItem(startGameTextPixi, startGameBtn);
        startBtnContainer.addChild(startGameBtn, startGameTextPixi);

        mainScreenContainer.addChild(startBtnContainer);

        return startBtnContainer;
    }
</script>
