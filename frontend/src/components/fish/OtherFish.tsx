import type { RoleKind } from "../../types/fish";
import { ScaledFish } from "./common";

export default function OtherFish({ kind }: { kind: Extract<RoleKind, "other"> }) {
  return (
    <ScaledFish kind={kind} viewBoxW={200} viewBoxH={80}>
      <g>
        <ellipse cx="100" cy="40" rx="100" ry="32" fill="#FDE68A" stroke="#B45309" strokeWidth="4"/>
        <polygon points="180,40 200,28 200,52" fill="#FDE68A" stroke="#B45309" strokeWidth="4"/>
        <line x1="0" y1="28" x2="0" y2="52" stroke="#B45309" strokeWidth="4"/>
        <circle cx="50" cy="28" r="4" fill="#111827"/>
      </g>
    </ScaledFish>
  );
}
