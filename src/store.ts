import { writable, type Writable } from "svelte/store";

export const welcomeMessage: Writable<string> = writable("");
