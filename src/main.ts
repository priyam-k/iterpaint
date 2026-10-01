import { HtmlCanvas } from "./html-canvas";

const cv = new HtmlCanvas(document.querySelector("canvas")!);
cv.clear("#fff");
cv.rect(20, 20, 100, 60, { fill: "skyblue", stroke: "navy", width: 2 });
cv.circle(200, 80, 40, { fill: "tomato" });
cv.line(0, 0, 300, 150, { stroke: "green", width: 3 });
cv.polyline([[50, 150], [100, 120], [150, 160]], { stroke: "purple" });
cv.text(20, 190, "hello", { font: "16px sans-serif", fill: "#333" });
