import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
    { path: "/", component: "welcome-page" },
    { path: "/new-room", component: "new-room" },
    { path: "/waiting", component: "waiting-page" },
    { path: "/access-room", component: "access-room" },
    { path: "/ready", component: "ready-page" },
    { path: "/game", component: "game-page" },
    { path: "/result", component: "result-page" },
    { path: "/score", component: "score-result" },
]);
