<script lang="ts">
    import { Application, Assets } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { gameStore, subscribeGameStore } from "./store";
    import { manifest } from "./manifest";
    import GameIcons from "./components/GameIcons.svelte";
    import GameTime from "./components/GameTime.svelte";
    // import Header from "./components/Header.svelte";
    import MainScreen from "./components/MainScreen.svelte";
    import "./index.scss";
    import memoryIcon from "./assets/memory.svg";
    import GameBoard from "./components/GameBoard.svelte";
    import { onNewGameClick, onRestartClick } from "./utils";
    import { EPlayerNum } from "./constants";
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

        await Assets.init({ manifest }).then(async () => {
            await Assets.loadBundle("svgs");
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
        }
    });

    onDestroy(() => {
        app.destroy(true, { children: true });
    });
</script>

<div
    class="app"
    style={`background: ${
        $gameStore.screen === "main" ? "var(--midnightBlue)" : "var(--white)"
    };`}
>
    <section class="app-section">
        <img src={memoryIcon} alt="memoryIcon" />
        {#if $gameStore.screen === "game"}
            <button on:click={onNewGameClick}>new game</button>
            <button on:click={onRestartClick}>restart</button>
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
    }
</style>
