import { writable, type Writable } from "svelte/store";
import { type TGameStore, initStore } from "./constants";

export const gameStore: Writable<TGameStore> = writable({ ...initStore });

type TUpdateFunction = (state: TGameStore) => TGameStore;

export const updateGameStore = (updateFunction: TUpdateFunction) => {
    gameStore.update(updateFunction);
};
