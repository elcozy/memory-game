import Atom from "./assets/gameIcons/Atom.svg";
import Bell from "./assets/gameIcons/Bell.svg";
import Bomb from "./assets/gameIcons/Bomb.svg";
import Truck from "./assets/gameIcons/Truck.svg";
import Brain from "./assets/gameIcons/Brain.svg";
import Bug from "./assets/gameIcons/Bug.svg";
import Car from "./assets/gameIcons/Car.svg";
import Cloud from "./assets/gameIcons/Cloud.svg";
import Code from "./assets/gameIcons/Code.svg";
import Coffee from "./assets/gameIcons/Coffee.svg";
import Dice from "./assets/gameIcons/Dice.svg";
import Dragon from "./assets/gameIcons/Dragon.svg";
import Fire from "./assets/gameIcons/Fire.svg";
import Hamburger from "./assets/gameIcons/Hamburger.svg";
import Lemon from "./assets/gameIcons/Lemon.svg";
import Meteor from "./assets/gameIcons/Meteor.svg";
import Sun from "./assets/gameIcons/Sun.svg";
import Plane from "./assets/gameIcons/Plane.svg";
import Wifi from "./assets/gameIcons/Wifi.svg";
import Title from "./assets/Title.svg";
import MemoryIcon from "./assets/memory.svg";

const svgIcons = [
    Atom,
    Bell,
    Bomb,
    Truck,
    Brain,
    Bug,
    Car,
    Cloud,
    Code,
    Coffee,
    Dice,
    Dragon,
    Fire,
    Hamburger,
    Lemon,
    Meteor,
    Plane,
    Sun,
    Wifi,
];

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
    ],
};
