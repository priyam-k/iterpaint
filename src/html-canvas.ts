import type { Canvas, Color, Style } from "./canvas";

export class HtmlCanvas implements Canvas {
  private ctx: CanvasRenderingContext2D;

  constructor(private el: HTMLCanvasElement) {
    const ctx = el.getContext("2d");
    if (!ctx) throw new Error("2D context unavailable");
    this.ctx = ctx;
  }

  get width() { return this.el.width; }
  get height() { return this.el.height; }

  clear(color?: Color) {
    if (color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  line(x1: number, y1: number, x2: number, y2: number, style: Style = {}) {
    this.draw(style, () => {
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
    }, false);
  }

  rect(x: number, y: number, w: number, h: number, style: Style = {}) {
    this.draw(style, () => this.ctx.rect(x, y, w, h));
  }

  circle(x: number, y: number, r: number, style: Style = {}) {
    this.draw(style, () => this.ctx.arc(x, y, r, 0, Math.PI * 2));
  }

  polyline(pts: [number, number][], style: Style & { closed?: boolean } = {}) {
    if (pts.length < 2) return;
    this.draw(style, () => {
      this.ctx.moveTo(pts[0][0], pts[0][1]);
      for (const [x, y] of pts.slice(1)) this.ctx.lineTo(x, y);
      if (style.closed) this.ctx.closePath();
    }, !!style.closed);
  }

  text(x: number, y: number, str: string, style: Style & { font?: string } = {}) {
    const c = this.ctx;
    c.save();
    if (style.font) c.font = style.font;
    c.fillStyle = style.fill ?? "black";
    c.fillText(str, x, y);
    if (style.stroke) {
      c.strokeStyle = style.stroke;
      c.lineWidth = style.width ?? 1;
      c.strokeText(str, x, y);
    }
    c.restore();
  }

  // Shared path → fill/stroke logic; save/restore keeps state from leaking.
  private draw(style: Style, path: () => void, fillable = true) {
    const c = this.ctx;
    c.save();
    c.beginPath();
    path();
    if (fillable && style.fill) {
      c.fillStyle = style.fill;
      c.fill();
    }
    if (style.stroke || !style.fill) {
      c.strokeStyle = style.stroke ?? "black";
      c.lineWidth = style.width ?? 1;
      c.stroke();
    }
    c.restore();
  }
}
