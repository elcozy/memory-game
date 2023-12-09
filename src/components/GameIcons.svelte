<script lang="ts">
    import { Application, Assets, Container, Graphics, Sprite } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { svgIconsArr } from "../manifest";
    import { GameSize, shuffleArray } from "../constants";

    export let app: Application;

    let bunny;
    let bunnyRotate;
    let gridContainer;
    let isDragging = false;

    let icons;

    onMount(() => {
        // setup();

        console.log("hi mounted");

        icons = shuffleArray(svgIconsArr);
        createGrid(GameSize.Four, app.renderer.width);
    });

    afterUpdate(() => {});

    onDestroy(() => {
        if (app) {
            if (bunnyRotate) app?.ticker?.remove(bunnyRotate);
            if (bunny) app.stage?.removeChild(bunny);

            if (gridContainer) app.stage?.removeChild(gridContainer);
        }
    });

    function setup() {
        const stage = app.stage;
        const items = [...svgIconsArr, "bunny"];
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

    const generateGameElements = (state) => {
        const gridDifferentElements = state.gridSize / 2;
        const newGameElements = [];
        const row = Math.sqrt(state.gridSize);

        let color;
        for (let i = 0; i < gridDifferentElements; i++) {
            let randomPosition = 0;
            let countInserted = 0;
            if (countInserted === 0) {
                color = Math.random() * 0xffffff;
            }
            do {
                randomPosition = Math.floor(Math.random() * state.gridSize);
                if (newGameElements[randomPosition] === undefined) {
                    newGameElements[randomPosition] = {
                        value: i + 1,
                        isVisible: false,
                        isActive: false,
                        iconColor: color,
                    };

                    countInserted++;
                }
            } while (countInserted < 2);

            countInserted = 0;
        }
        console.log(newGameElements);
        return newGameElements;
    };

    function createGrid(rows: GameSize, containerWidth, columns = rows) {
        const gap = 10;
        let circleDiameter = containerWidth / rows - gap - gap / rows;
        let circleRadius = circleDiameter / 2;

        const gridSize = Math.pow(rows, 2);

        const gameElements = generateGameElements({
            gridSize: gridSize,
        });

        console.log(containerWidth, circleRadius);
        gridContainer = new Container();

        let currentCircle = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const circle = new Graphics();
                circle.beginFill(0xffffc9);
                // circle.beginFill(0x304859);
                circle.drawCircle(0, 0, circleRadius);
                circle.endFill();

                const x = j * (circleDiameter + gap) + circleRadius + gap;
                const y = i * (circleDiameter + gap) + circleRadius + gap;

                circle.position.set(x, y);

                circle.interactive = true;
                circle.cursor = "pointer";
                // console.log("currentCircle", currentCircle);

                const icon = Sprite.from(
                    Assets.get(icons[gameElements[currentCircle].value])
                );
                // icon.width = 30;
                // icon.height = 30;

                const desiredHeight = 40;
                icon.height = desiredHeight;

                // Calculate the corresponding width to maintain aspect ratio
                const aspectRatio =
                    icon.texture.orig.width / icon.texture.orig.height;
                icon.width = icon.height * aspectRatio;

                icon.anchor.set(0.5);
                icon.position.set(x, y);
                // icon.tint = 0xfff000;

                // Apply the filter to the sprite
                icon.tint = gameElements[currentCircle].iconColor;

                // icon.visible = false;
                circle.on("mousedown", () => {
                    console.log(
                        "clicked on:",
                        i,
                        j,
                        "currentCircle:",
                        currentCircle
                    );
                    icon.visible = !icon.visible;
                });
                currentCircle++;
                gridContainer.addChild(circle, icon);
            }
        }
        app.stage.addChild(gridContainer);
    }
</script>
