import { HtmlCanvas } from "./html-canvas";
import { Controller } from "./controller";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const upload = $<HTMLInputElement>("upload");
const backBtn = $<HTMLButtonElement>("back");
const fwdBtn = $<HTMLButtonElement>("forward");
const status = $<HTMLSpanElement>("status");
const targetEl = $<HTMLCanvasElement>("target");
const outputEl = $<HTMLCanvasElement>("output");

let ctrl: Controller | null = null;

function sync() {
  backBtn.disabled = !ctrl?.canBack;
  fwdBtn.disabled = !ctrl;
  status.textContent = ctrl ? `step ${ctrl.step}` : "";
}

upload.addEventListener("change", async () => {
  const file = upload.files?.[0];
  if (!file) return;
  const bmp = await createImageBitmap(file);

  // Optional: downscale big images, since SSIM per candidate gets expensive fast.
  const scale = Math.min(1, 256 / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);

  for (const el of [targetEl, outputEl]) { el.width = w; el.height = h; }
  const tctx = targetEl.getContext("2d")!;
  tctx.drawImage(bmp, 0, 0, w, h);

  ctrl = new Controller(new HtmlCanvas(outputEl), tctx.getImageData(0, 0, w, h));
  sync();
});

fwdBtn.addEventListener("click", () => { ctrl?.forward(); sync(); });
backBtn.addEventListener("click", () => { ctrl?.back(); sync(); });
