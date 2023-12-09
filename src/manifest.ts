import Atom from "./assets/gameIcons/Atom.svg";
import Bahai from "./assets/gameIcons/Bahai.svg";
import Bell from "./assets/gameIcons/Bell.svg";
import Bomb from "./assets/gameIcons/Bomb.svg";
import Bookmark from "./assets/gameIcons/Bookmark.svg";
import Brain from "./assets/gameIcons/Brain.svg";
import Bug from "./assets/gameIcons/Bug.svg";
import Car from "./assets/gameIcons/Car.svg";
import Cloud from "./assets/gameIcons/Cloud.svg";
import CodeBranch from "./assets/gameIcons/CodeBranch.svg";
import Coffee from "./assets/gameIcons/Coffee.svg";
import DiceFive from "./assets/gameIcons/DiceFive.svg";
import Dragon from "./assets/gameIcons/Dragon.svg";
import Fire from "./assets/gameIcons/Fire.svg";
import Hamburger from "./assets/gameIcons/Hamburger.svg";
import Lemon from "./assets/gameIcons/Lemon.svg";
import Meteor from "./assets/gameIcons/Meteor.svg";
import Sun from "./assets/gameIcons/Sun.svg";
import Title from "./assets/Title.svg";

const svgIcons = [
    Atom,
    Bahai,
    Bell,
    Bomb,
    Bookmark,
    Brain,
    Bug,
    Car,
    Cloud,
    CodeBranch,
    Coffee,
    DiceFive,
    Dragon,
    Fire,
    Hamburger,
    Lemon,
    Meteor,
    Sun,
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

// console.log(arrayOfObjects, svgIconsArr);

export const manifest = {
    bundles: [
        {
            name: "svgs",
            assets: [
                ...arrayOfObjects,
                {
                    alias: "bunny",
                    src: "https://pixijs.com/assets/bunny.png",
                },
                {
                    alias: "Title",
                    src: Title,
                },
            ],
        },

        // {
        //     name: "game-screen",
        //     assets: [
        //         {
        //             alias: "character",
        //             src: "robot.png",
        //         },
        //         {
        //             alias: "enemy",
        //             src: "bad-guy.png",
        //         },
        //     ],
        // },
    ],
};
