import type { Canvas, Color } from "./canvas";

export type Point = [number, number];
export interface Shape { points: Point[]; color: Color; }

export class Controller {
  private history: Shape[] = []; // every shape ever computed
  private index = 0;             // how many are currently applied

  constructor(
    private out: Canvas,
    private target: ImageData,   // original pixels, for scoring + color sampling
    private k = 3,               // vertices per shape
    private n = 50,              // candidates per step
  ) {
    this.redraw();
  }

  get step() { return this.index; }
  get canBack() { return this.index > 0; }

  forward() {
    // Re-applying an undone step is free; only compute when at the frontier.
    if (this.index === this.history.length) this.history.push(this.search());
    this.index++;
    this.redraw();
  }

  back() {
    if (!this.canBack) return;
    this.index--;
    this.redraw();
  }

  private redraw() {
    this.out.clear("#fff");
    for (const s of this.history.slice(0, this.index)) {
      this.out.polyline(s.points, { fill: s.color, closed: true });
    }
  }

  private search(): Shape {
    // TODO: generate n candidates, color each, score with SSIM, keep the best.
    return { points: this.randomPoints(), color: "#888" };
  }

  private randomPoints(): Point[] {
    const { width: w, height: h } = this.target;
    return Array.from({ length: this.k }, () => [Math.random() * w, Math.random() * h] as Point);
  }
}
