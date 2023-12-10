import { writable, type Writable } from "svelte/store";
import { type TGameStore, initStore } from "./constants";

export const gameScreen: Writable<"game" | "main"> = writable("main");

export const welcomeMessage: Writable<string> = writable("");
export const gameStore: Writable<TGameStore> = writable({ ...initStore });

type TUpdateFunction = (state: TGameStore) => TGameStore;

export const updateGameStore = (updateFunction: TUpdateFunction) => {
    gameStore.update(updateFunction);
};
