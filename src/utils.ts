import { get } from "svelte/store";
import { gameStore, updateGameStore, updateToGameStore } from "./store";
import { EPlayerNum, GameSize, GameType, initStore } from "./constants";

export const setGameFinished = () => {
    updateGameStore((state) => {
        state.isGameFinished = true;
        return state;
    });
};
export const resetLastTwoMoves = (activePlayerIndex) => {
    updateGameStore((state) => {
        // state.moves[activePlayerIndex] += 1;
        state.lastTwoMoves = [];
        return state;
    });
};

export const handleClickGameElement = (i, j) => {
    if (get(gameStore).lastTwoMoves.length >= 2) return;
    updateGameStore((state) => {
        const currElement = state.gameElements[i][j];
        currElement.isVisible = true;
        currElement.isActive = true;

        currElement.innerElement.visible = true;
        currElement.circle.interactive = false;
        state.movesTotal += 1;
        console.log("currElement.innerElement", currElement.innerElement);
        if (get(gameStore).lastTwoMoves.length < 2) {
            state.lastTwoMoves.push(currElement);
        }
        return state;
    });
};

export const disableElementsActiveState = (unActiveGameArr) => {
    updateGameStore((state) => {
        unActiveGameArr.forEach((elementToHide) => {
            const currElementHide =
                state.gameElements[elementToHide.position.row][
                    elementToHide.position.column
                ];
            currElementHide.isActive = false;
        });

        return state;
    });
};
export const hideGameElementsVisibility = (hideGameArr) => {
    updateGameStore((state) => {
        hideGameArr.forEach((elementToHide) => {
            const currElementHide =
                state.gameElements[elementToHide.position.row][
                    elementToHide.position.column
                ];
            currElementHide.isVisible = false;

            currElementHide.innerElement.visible = false;
            currElementHide.circle.interactive = true;

            currElementHide.circle.clear();
            currElementHide.circle.beginFill(0x304859);
            currElementHide.circle.drawCircle(
                0,
                0,
                currElementHide.circleRadius
            );
            currElementHide.circle.endFill();
        });

        return state;
    });
};

export const onNewGameClick = () => {
    console.log("New Game");
    updateGameStore((state) => {
        state.gridType = GameType.SvgIconsArr;
        state.gridSize = GameSize.Four;
        state.playerNum = EPlayerNum.One;

        return state;
    });

    updateToGameStore("screen", "main");
};
export const onRestartClick = () => {
    gameStore.update((prev) => {
        return {
            ...initStore,
            gridType: prev.gridType,
            gridSize: prev.gridSize,
            playerNum: prev.playerNum,
            // gameElements: prev.gameElements,
        };
    });
    updateToGameStore("screen", "game");
};
