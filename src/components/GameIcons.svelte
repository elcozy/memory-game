<script lang="ts">
    import { Application, Assets, Container, Graphics, Sprite } from "pixi.js";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { svgIconsArr } from "../manifest";
    import {
        GameSize,
        createGameRandomItems,
        shuffleArray,
    } from "../constants";
    import { tempMoves } from "../store";

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
        createGrid(GameSize.Four, app.renderer.width - 100);
    });

    afterUpdate(() => {});

    onDestroy(() => {
        if (app) {
            if (bunnyRotate) app?.ticker?.remove(bunnyRotate);
            if (bunny) app.stage?.removeChild(bunny);

            if (gridContainer) app.stage?.removeChild(gridContainer);
        }
    });

    function createGrid(rows: GameSize, containerWidth, columns = rows) {
        const gap = 10;
        let circleDiameter = containerWidth / rows - gap - gap / rows;
        let circleRadius = circleDiameter / 2;

        const gridSize = Math.pow(rows, 2);

        const gameElements = createGameRandomItems(gridSize);

        console.log(containerWidth, circleRadius);
        gridContainer = new Container();

        let currentCircle = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const circle = new Graphics();
                const elementColor = gameElements[currentCircle].iconColor;

                circle.beginFill(elementColor);
                // circle.beginFill(0xffffc9);
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

                // icon.tint = elementColor;

                const setOpenState = (isOpen = true) => {
                    circle.clear();
                    circle.beginFill(isOpen ? elementColor : 0x304859);
                    // circle.beginFill(isOpen ? 0xfda214 : 0x304859);
                    circle.drawCircle(0, 0, circleRadius);
                    circle.endFill();
                };
                const setHoverState = (isOver = true) => {
                    if (icon.visible) return;

                    circle.clear();
                    circle.beginFill(
                        isOver
                            ? 0x6395b8
                            : icon.visible
                              ? elementColor
                              : //   ? 0xfda214
                                0x304859
                    );
                    circle.drawCircle(0, 0, circleRadius);
                    circle.endFill();
                };

                // icon.visible = false;
                circle.on("mousedown", () => {
                    console.log(
                        "clicked on:",
                        i,
                        j,
                        "currentCircle:",
                        currentCircle
                    );
                    tempMoves.update((prev) => prev + 1);
                    icon.visible = !icon.visible;
                    setOpenState(icon.visible);
                });

                circle.on("pointerover", () => {
                    setHoverState(true);
                });

                circle.on("pointerout", () => {
                    setHoverState(false);
                });

                currentCircle++;
                gridContainer.addChild(circle, icon);
            }
        }
        app.stage.addChild(gridContainer);
    }
</script>
