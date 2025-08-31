export type RoleKind = "father" | "mother" | "child" | "other";

export const SIZE: Record<RoleKind, { rx: number; ry: number }> = {
  father: { rx: 54, ry: 20 },
  mother: { rx: 46, ry: 17 },
  child:  { rx: 36, ry: 14 },
  other:  { rx: 42, ry: 16 }
};
