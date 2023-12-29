<script lang="ts">
    import { Application, Assets } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { gameStore, subscribeGameStore } from "./store";
    import { fontList, manifest } from "./manifest";
    import GameTime from "./components/GameTime.svelte";
    // import Header from "./components/Header.svelte";
    import MainScreen from "./components/MainScreen.svelte";
    import "./index.scss";
    import memoryIcon from "./assets/memory.svg";
    import memoryDarkIcon from "./assets/memoryDark.svg";
    import GameBoard from "./components/GameBoard.svelte";
    import { onNewGameClick, onRestartClick, setApp } from "./utils";
    import { EPlayerNum } from "./types";
    import { initStore } from "./constants";
    let pixiContainer;

    let app: Application;
    let appLoaded;

    onMount(async () => {
        app = new Application({
            width: 654,
            height: 654,
            // height: 733,

            backgroundAlpha: 0,

            antialias: true,
            // resolution: 2,
        });

        app.stage.interactiveChildren = true;
        app.stage.sortableChildren = true;

        setApp(app);

        await Assets.init({ manifest }).then(async () => {
            await Assets.loadBundle("svgs");
            await Assets.loadBundle("fonts");

            fontList.forEach((fonts) => {
                new FontFace(fonts.name, `url(${fonts.srcs})`)
                    .load()
                    .then(function (loadedFontFace) {
                        document.fonts.add(loadedFontFace);
                    });
            });

            appLoaded = true;
        });
    });

    afterUpdate(() => {
        if (!pixiContainer.contains(app.view)) {
            pixiContainer.appendChild(app.view);
        }
    });

    subscribeGameStore("screen", (currScreen) => {
        console.log("currScreen", currScreen);
        if (currScreen === "main") {
            app?.renderer.resize(654, 654);
        } else {
            const appWidth =
                $gameStore.playerNum === EPlayerNum.One ? 654 : 654;
            const appHeight =
                $gameStore.playerNum === EPlayerNum.One ? 733 : 650;
            app?.renderer.resize(appWidth, appHeight);
        }
    });

    onDestroy(() => {
        app.destroy(true, { children: true });
        gameStore.set(initStore);
    });
</script>

<div
    class="app"
    style={`background: ${
        $gameStore.screen === "main"
            ? "var(--midnightBlue)"
            : // : $gameStore.elementsFound ===
              //     Math.pow($gameStore.gameElements.length, 2)
              //   ? "var(--darkGray)"
              "var(--white)"
    };`}
>
    <section class="app-section">
        {#if $gameStore.screen === "game"}
            <div class="heading">
                <img src={memoryDarkIcon} alt="memoryIcon" />
                <div class="btns">
                    <button on:click={onNewGameClick} class="new-game"
                        >New Game</button
                    >
                    <button on:click={onRestartClick} class="restart"
                        >Restart</button
                    >
                </div>
            </div>
        {/if}
        <section class="pixi-container" bind:this={pixiContainer} />
        {#if appLoaded}
            {#if $gameStore.screen === "game"}
                <GameBoard {app} />
                <!-- <Header {app} /> -->
                <!-- <GameMoves {app} /> -->
                <GameTime {app} />
            {/if}
            {#if $gameStore.screen === "main"}
                <!-- <Bunny {app} /> -->

                <MainScreen {app} />
            {/if}
        {/if}
    </section>
</div>

<style lang="scss">
    .app-section {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        img {
            width: 20%;
        }

        .heading {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        .btns {
            display: flex;
            gap: 10px;
            button {
                border: 0;
                font-family: "Atkinson Hyperlegible", sans-serif;

                font-weight: bold;
                font-size: 20px;
                cursor: pointer;
                &.restart {
                    background: var(--orange);
                    color: var(--white);
                    padding: 15px 25px;
                    border-radius: 20px;
                }
                &.new-game {
                    background: var(--darkGray);
                    color: var(--darkBlue);
                    padding: 15px 25px;
                    border-radius: 20px;
                }
            }
        }
    }
</style>
