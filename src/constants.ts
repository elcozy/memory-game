import { EPlayerNum, GameSize, GameType, type TGameStore } from "./types";
import { Logger } from "./utils";

export const maxPlayers = 4;

export const initStore: TGameStore = {
    timeSpent: 0,
    movesTotal: 0,
    timeElapsed: "0:00",
    gridType: GameType.SvgIconsArr,
    gridSize: GameSize.Four,

    gameElements: [],
    screen: "main",
    playerNum: EPlayerNum.One,
    elementsFound: 0,

    moves: [],
    pairs: [],
    lastTwoMoves: [],
    gameStarted: 0,
    activePlayerIndex: 0,
    isGameFinished: false,
};

export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
interface Dimensions {
    width: number;
    height: number;
}

export function calculateDimensions(
    desiredWidth: number | null,
    desiredHeight: number | null,
    sprite: { texture: { orig: { width: number; height: number } } }
): Dimensions {
    const dimensions: Dimensions = { width: 0, height: 0 };

    if (desiredWidth) {
        // Calculate height based on desired width
        dimensions.width = desiredWidth;
        dimensions.height =
            dimensions.width /
            (sprite.texture.orig.width / sprite.texture.orig.height);
    } else if (desiredHeight) {
        // Calculate width based on desired height
        dimensions.height = desiredHeight;
        dimensions.width =
            dimensions.height *
            (sprite.texture.orig.width / sprite.texture.orig.height);
    } else {
        // If neither width nor height is provided, return original dimensions
        dimensions.width = sprite.texture.orig.width;
        dimensions.height = sprite.texture.orig.height;
    }

    return dimensions;
}

export function setDimensions(
    desiredWidth: number | null,
    desiredHeight: number | null,
    sprite: {
        texture: { orig: { width: number; height: number } };
        height: number;
        width: number;
    }
) {
    const imgSize = calculateDimensions(desiredWidth, desiredHeight, sprite);

    sprite.height = imgSize.height;
    sprite.width = imgSize.width;
}
export const createGameRandomItems = (gridSize) => {
    const gridDifferentElements = gridSize / 2;
    const newGameElements = [];

    let color;
    for (let i = 0; i < gridDifferentElements; i++) {
        let randomPosition = 0;
        let countInserted = 0;
        if (countInserted === 0) {
            color = Number((Math.random() * 0xffffff).toFixed(2));
        }
        do {
            randomPosition = Math.floor(Math.random() * gridSize);
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
    Logger.log(newGameElements);
    return newGameElements;
};

export const centerItem = (element, parent) => {
    element.position.set(
        parent.x + parent.width / 2 - element.width / 2,
        parent.y + parent.height / 2 - element.height / 2
    );
};
