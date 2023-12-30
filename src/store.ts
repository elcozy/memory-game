import { get, writable, type Writable } from "svelte/store";
import { type TGameStore } from "./types";

import { initStore } from "./constants";
import { onDestroy } from "svelte";
import { Logger } from "./utils";

export const gameStore: Writable<TGameStore> = writable({ ...initStore });
export const timeElapsed: Writable<string> = writable("0.00");

type TUpdateFunction = (state: TGameStore) => TGameStore;

export const updateGameStore = (updateFunction: TUpdateFunction) => {
    gameStore.update(updateFunction);
};

export const timeInterval = writable<NodeJS.Timeout>();
function createTimeCount() {
    const { subscribe, update, set } = writable<`${number}:${number}`>("0:00");
    const secs = writable<number>(0);
    const { subscribe: secSubscribe, update: secUpdate, set: secSet } = secs;

    return {
        subscribe,
        secs,
        secUpdate,
        reset: () => {
            set("0:00");
            secSet(0);
        },
        update,
        set,
        secSubscribe,
    };
}

export const timeSpent = createTimeCount();

let currGameStore = get(gameStore);

export let subscribeGameStore = <K extends keyof TGameStore>(
    key: K,
    action: (e: TGameStore[K]) => void
) => {
    const unsubGame = gameStore.subscribe((currGame) => {
        if (!currGame || currGameStore[key] === currGame[key]) return;
        action(currGame[key]);

        Logger.log("subscribe to  GameStore -", key, currGame[key]);
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
    Logger.log("updated store", key, keyUpdate);

    gameStore.update((currGame) => {
        return {
            ...currGame,
            [key]: keyUpdate,
        };
    });
};
