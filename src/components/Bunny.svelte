<script lang="ts">
    import { Application, Assets, Sprite, Texture } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { svgIconsArr } from "../manifest";

    export let app: Application;

    let bunny;
    let bunnyRotate;
    let isDragging = false;

    onMount(() => {
        setup();
    });

    afterUpdate(() => {});

    onDestroy(() => {
        if (app) {
            if (bunnyRotate) app?.ticker?.remove(bunnyRotate);
            if (bunny) app.stage?.removeChild(bunny);
        }
    });

    function setup() {
        const stage = app.stage;
        const items = [...svgIconsArr];
        // const items = [...svgIconsArr, "bunny"];
        bunny = Sprite.from(
            Assets.get(items[Math.floor(Math.random() * items.length)])
        );

        // bunny = Sprite.from("https://pixijs.com/assets/bunny.png");

        bunny.position.set(0, 0);
        bunny.anchor.set(0);

        stage.addChild(bunny);

        const appWidth = app.renderer.width;
        const appHeight = app.renderer.height;
        bunnyRotate = (delta) => {
            if (isDragging) {
                return;
            }
            // bunny.rotation += 0.1 * delta;
            if (bunny.y < 1 && bunny.x <= appWidth - bunny.width - 1) {
                bunny.x += 2 * delta;
            } else if (
                bunny.x >= appWidth - bunny.x &&
                bunny.y <= appHeight - bunny.height - 2
            ) {
                bunny.y += 2 * delta;
            } else if (bunny.y >= appHeight - bunny.height - 2 && bunny.x > 1) {
                bunny.x -= 2 * delta;
            } else if (bunny.y >= 1 && bunny.x <= 2) {
                bunny.y -= 2 * delta;
            }
        };
        app.view.style.cursor = "pointer";

        app.view.addEventListener("mousedown", () => {
            isDragging = true;
            app.ticker.stop();
        });

        app.view.addEventListener("mouseup", () => {
            isDragging = false;
            app.ticker.start();
        });

        app.ticker.add(bunnyRotate);
    }
</script>

<!-- <FontAwesomeIcon icon={["fal", "coffee"]} /> -->
