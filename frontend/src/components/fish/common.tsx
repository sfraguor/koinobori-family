import type { ReactNode } from "react";
import { SIZE } from "../../types/fish";
import type { RoleKind } from "../../types/fish";

export function ScaledFish({
  kind,
  viewBoxW,
  viewBoxH,
  children,
}: {
  kind: RoleKind;
  viewBoxW: number;
  viewBoxH: number;
  children: ReactNode;
}) {
  const { rx, ry } = SIZE[kind];
  const sx = (rx * 2) / viewBoxW;
  const sy = (ry * 2) / viewBoxH;
  // situamos el arte con su esquina sup-izq en (-rx,-ry) y escalamos
  return <g transform={`translate(${-rx},${-ry}) scale(${sx} ${sy})`}>{children}</g>;
}
