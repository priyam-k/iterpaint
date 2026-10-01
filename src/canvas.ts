export type Color = string; // any CSS color: "#f00", "rgb(...)", "red"

export interface Style {
  stroke?: Color;
  fill?: Color;
  width?: number;
}

export interface Canvas {
  readonly width: number;
  readonly height: number;
  clear(color?: Color): void;
  line(x1: number, y1: number, x2: number, y2: number, style?: Style): void;
  rect(x: number, y: number, w: number, h: number, style?: Style): void;
  circle(x: number, y: number, r: number, style?: Style): void;
  polyline(points: [number, number][], style?: Style & { closed?: boolean }): void;
  text(x: number, y: number, str: string, style?: Style & { font?: string }): void;
}
