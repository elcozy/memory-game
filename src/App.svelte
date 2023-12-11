<script lang="ts">
    import { Application, Assets } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { gameStore, welcomeMessage } from "./store";
    import { manifest } from "./manifest";
    import GameIcons from "./components/GameIcons.svelte";
    import GameMoves from "./components/GameMoves.svelte";
    import GameTime from "./components/GameTime.svelte";
    import Header from "./components/Header.svelte";
    import MainScreen from "./components/MainScreen.svelte";

    let pixiContainer;

    let app: Application;
    let appLoaded;

    onMount(async () => {
        app = new Application({
            width: 600,
            height: 800,
            backgroundColor: 0xcdf005,
            // antialias: true,
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
        welcomeMessage.set("Hello Pixi -x- Svelte");
    });

    const unsubGameStore = gameStore.subscribe((currGameStore) => {
        // console.log("currGameStore", currGameStore);
    });

    onDestroy(() => {
        app.destroy(true, { children: true });
        unsubGameStore();
    });
</script>

<section>
    <span> {$welcomeMessage}</span>

    <section class="pixi-container" bind:this={pixiContainer} />

    {#if appLoaded}
        {#if $gameStore.screen === "game"}
            <GameIcons {app} />
            <Header {app} />
            <GameMoves {app} />
            <GameTime {app} />
        {/if}
        {#if $gameStore.screen === "main"}
            <!-- <Bunny {app} /> -->

            <MainScreen {app} />
        {/if}
    {/if}
</section>
