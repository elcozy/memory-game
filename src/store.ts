import { get, writable, type Writable } from "svelte/store";
import { type TGameStore, initStore } from "./constants";
import { onDestroy } from "svelte";

export const gameStore: Writable<TGameStore> = writable({ ...initStore });

type TUpdateFunction = (state: TGameStore) => TGameStore;

export const updateGameStore = (updateFunction: TUpdateFunction) => {
    gameStore.update(updateFunction);
};

let currGameStore = get(gameStore);

export let subscribeGameStore = <K extends keyof TGameStore>(
    key: K,
    action: (e: TGameStore[K]) => void
) => {
    const unsubGame = gameStore.subscribe((currGame) => {
        if (!currGame || currGameStore[key] === currGame[key]) return;
        action(currGame[key]);

        console.log("subscribe to  GameStore -", key, currGame[key]);
        currGameStore = currGame;
    });

    onDestroy(() => {
        unsubGame();
    });
};

export let updateToGameStore = <K extends keyof TGameStore>(
    key: K,
    keyUpdate: TGameStore[K]
) => {
    console.log("updated store", key, keyUpdate);

    gameStore.update((currGame) => {
        return {
            ...currGame,
            [key]: keyUpdate,
        };
    });
};
