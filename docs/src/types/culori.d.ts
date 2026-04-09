declare module 'culori' {
  export function oklch(
    value: string
  ):
    | {
        l?: number;
        c?: number;
        h?: number;
        alpha?: number;
      }
    | undefined;

  export function formatHex(color: unknown): string | undefined;
  export function formatCss(color: unknown): string;

  export function wcagContrast(
    foreground: unknown,
    background: unknown
  ): number | undefined;
}
