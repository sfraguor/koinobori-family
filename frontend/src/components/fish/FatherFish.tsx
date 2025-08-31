import type { RoleKind } from "../../types/fish";
import { ScaledFish } from "./common";

export default function FatherFish({ kind }: { kind: Extract<RoleKind, "father"> }) {
  // De momento un placeholder simple (puedes sustituir por tu SVG)
  // viewBox simple 200x80
  return (
    <ScaledFish kind={kind} viewBoxW={200} viewBoxH={80}>
      <g>
        <ellipse cx="100" cy="40" rx="100" ry="36" fill="#9CA3AF" stroke="#111827" strokeWidth="4"/>
        <polygon points="180,40 200,28 200,52" fill="#9CA3AF" stroke="#111827" strokeWidth="4"/>
        <line x1="0" y1="28" x2="0" y2="52" stroke="#111827" strokeWidth="4"/>
        <circle cx="50" cy="28" r="4" fill="#111827"/>
      </g>
    </ScaledFish>
  );
}
