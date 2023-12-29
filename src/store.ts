import { get, writable, type Writable } from "svelte/store";
import { type TGameStore } from "./types";

import { initStore } from "./constants";
import { onDestroy } from "svelte";

export const gameStore: Writable<TGameStore> = writable({ ...initStore });
export const timeElapsed: Writable<string> = writable("0.00");

type TUpdateFunction = (state: TGameStore) => TGameStore;

export const updateGameStore = (updateFunction: TUpdateFunction) => {
    gameStore.update(updateFunction);
};

function createTimeCount() {
    const { subscribe, update, set } = writable<`${number}:${number}`>("0:0");
    let interval;
    let seconds = 0;

    function startTimer() {
        interval = setInterval(() => {
            seconds += 1;

            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            const formattedTime =
                remainingSeconds < 10
                    ? `${minutes}:0${remainingSeconds}`
                    : `${minutes}:${remainingSeconds}`;

            timeElapsed.set(formattedTime);
        }, 1000);
    }
    return {
        subscribe,

        start: () => {
            startTimer();
        },
        seconds,
        addSec: () => seconds + 1,
        // increment: () => update((n) => n + 1),
        reset: () => {
            set("0:00");
            clearInterval(interval);
            startTimer();
        },
        stop: () => {
            clearInterval(interval);
        },
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
