<script lang="ts">
    import { Application } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { welcomeMessage } from "./store";
    import Bunny from "./components/Bunny.svelte";
    let pixiContainer;

    let app: Application;
    let appLoaded;

    onMount(() => {
        app = new Application({
            width: 300,
            height: 300,
            backgroundColor: 0xcdf005,
        });

        app.stage.interactiveChildren = false;
        app.stage.sortableChildren = true;

        appLoaded = true;
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
        <Bunny {app} />
    {/if}
</section>
