<script lang="ts">
    import { Application, Assets } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { welcomeMessage } from "./store";
    import Bunny from "./components/Bunny.svelte";
    import { manifest } from "./manifest";
    import GameIcons from "./components/GameIcons.svelte";
    import GameMoves from "./components/GameMoves.svelte";
    import GameTime from "./components/GameTime.svelte";

    let pixiContainer;

    let app: Application;
    let appLoaded;

    onMount(async () => {
        app = new Application({
            width: 700,
            height: 700,
            backgroundColor: 0xcdf005,
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

    onDestroy(() => {
        app.destroy(true, { children: true });
    });
</script>

<section>
    <span> {$welcomeMessage}</span>

    <section class="pixi-container" bind:this={pixiContainer} />

    {#if appLoaded}
        <!-- <Bunny {app} /> -->
        <GameIcons {app} />
        <GameMoves {app} />
        <GameTime {app} />
    {/if}
</section>
