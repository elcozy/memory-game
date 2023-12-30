import { writable, type Writable } from "svelte/store";
import type { TGameStore } from "../types";
import { initStore } from "../constants";

export const gameStore: Writable<TGameStore> = writable(initStore);
