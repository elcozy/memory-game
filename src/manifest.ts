import Title from "./assets/Title.svg";
import MemoryIcon from "./assets/memory.svg";

import { fontList } from "./assets/fontList";
import { svgIcons } from "./assets/svgIconsArr";

const arrayOfObjects = svgIcons.map((src) => ({
    alias: src.split("/").pop().split(".")[0],
    src,
}));

export const svgIconsArr = svgIcons.map((variable) =>
    variable
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "")
);

export const manifest = {
    bundles: [
        {
            name: "svgs",
            assets: [
                ...arrayOfObjects,
                // {
                //     alias: "bunny",
                //     src: "https://pixijs.com/assets/bunny.png",
                // },
                {
                    alias: "Title",
                    src: Title,
                },
                {
                    alias: "Memory",
                    src: MemoryIcon,
                },
            ],
        },
        {
            name: "fonts",
            assets: fontList,
        },
    ],
};
