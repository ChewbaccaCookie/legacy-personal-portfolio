/* eslint-disable no-console */
import { addAnchorNavigation } from "./logic/animated";
import { initBackground } from "./logic/background";
import "./styles/icons/scss/lineicons.scss";
import "./styles/style.sass";

console.log("%c Ohh Hey,", "background: white; color: #ea5847");
console.log("%c Please, take a cookie 🍪", "background: white; color: #ea5847");

addAnchorNavigation();

initBackground();
