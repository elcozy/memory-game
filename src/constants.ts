export const maxPlayers = 4;
export enum GameType {
    svgIconsArr,
    Numbers,
}

export enum GameSize {
    Four = 4,
    Six = 6,
}

export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export const createGameRandomItems = (gridSize) => {
    const gridDifferentElements = gridSize / 2;
    const newGameElements = [];
    // const row = Math.sqrt(gridSize);

    let color;
    for (let i = 0; i < gridDifferentElements; i++) {
        let randomPosition = 0;
        let countInserted = 0;
        if (countInserted === 0) {
            color = Math.random() * 0xffffff;
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
    console.log(newGameElements);
    return newGameElements;
};
