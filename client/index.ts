import "./routes";

import { initPlay } from "./components/plays";
import { initText } from "./components/text";
import { initResult } from "./components/result";
import { initButton } from "./components/button";
import { initCountDown } from "./components/count-down";

import "./pages/welcome/index";
import "./pages/new-room/index";
import "./pages/waiting/index";
import "./pages/access-room/index";
import "./pages/ready/index";
import "./pages/game/index";
import "./pages/result/index";
import "./pages/score/index";
import { state } from "./state";

function main() {
    initPlay();
    initText();
    initResult();
    initButton();
    initCountDown();
    state.init();
}

main();
