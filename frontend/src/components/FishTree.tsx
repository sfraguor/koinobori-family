// frontend/src/components/FishTree.tsx
type Fish = { id: string; name?: string | null; role?: string | null };
type RoleKind = "father" | "mother" | "child" | "other";
import type { RoleKind } from "../types/fish"; // ajusta la ruta si es necesario


function roleKind(role?: string | null): RoleKind {
  if (!role) return "other";
  const r = role.toLowerCase();
  if (/(padre|father|otōsan)/.test(r)) return "father";
  if (/(madre|mother|okāsan)/.test(r)) return "mother";
  if (/^(hij[oa]|child)/.test(r)) return "child";
  return "other";
}
function labelRole(role?: string | null) {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

// Tamaños por rol (largo x alto del cuerpo)
const SIZE: Record<RoleKind, { rx: number; ry: number }> = {
  father: { rx: 54, ry: 20 },   // más grande
  mother: { rx: 46, ry: 17 },
  child:  { rx: 36, ry: 14 },   // más pequeño que madre
  other:  { rx: 42, ry: 16 }
};

// Colores suaves
const COLORS: Record<RoleKind, { fill: string; stroke: string; eye: string }> = {
  father: { fill: "#9CA3AF", stroke: "#111827", eye: "#111827" }, // gris/negro
  mother: { fill: "#FCA5A5", stroke: "#B91C1C", eye: "#111827" }, // rojo suave
  child:  { fill: "#93C5FD", stroke: "#1D4ED8", eye: "#111827" }, // azul suave
  other:  { fill: "#FDE68A", stroke: "#B45309", eye: "#111827" }  // ámbar
};

export default function FishTree({ fishes, renderFish }: { fishes: Fish[]; renderFish?: (kind: RoleKind) => JSX.Element;}) {
  // Orden koinobori
  const fathers = fishes.filter(f => roleKind(f.role) === "father");
  const mothers = fishes.filter(f => roleKind(f.role) === "mother");
  const children = fishes.filter(f => roleKind(f.role) === "child");
  const others   = fishes.filter(f => roleKind(f.role) === "other");
  const ordered  = [...fathers, ...mothers, ...children, ...others];

  // Lienzo: raíz a la IZQUIERDA, peces a la DERECHA (mirando a la IZQUIERDA)
  const count = Math.max(ordered.length, 1);
  const lineGap = 90;
  const paddingTop = 80;
  const height = paddingTop * 2 + lineGap * (count - 1) + 200;
  const width = 1000;

  const rootX = 120;
  const rootY = Math.max(220, height / 2);
  const fishX = 420;

  // Koi orientado a la IZQUIERDA (boca a la izquierda, cola a la derecha)
  const Koi = ({ kind }: { kind: RoleKind }) => {
    const s = SIZE[kind];
    const c = COLORS[kind];
    const rx = s.rx, ry = s.ry;

    return (
      <g>
        {/* cuerpo */}
        <ellipse rx={rx} ry={ry} fill={c.fill} stroke={c.stroke} strokeWidth="2" />
        {/* boca a la IZQUIERDA */}
        <line x1={-rx} y1={-ry * 0.4} x2={-rx} y2={ry * 0.4} stroke={c.stroke} strokeWidth="2" />
        {/* cola a la DERECHA */}
        <polygon
          points={`${rx},0 ${rx + ry},${-ry * 0.6} ${rx + ry},${ry * 0.6}`}
          fill={c.fill}
          stroke={c.stroke}
          strokeWidth="2"
        />
        {/* ojo hacia la izquierda */}
        <circle cx={-rx * 0.5} cy={-ry * 0.25} r={2.8} fill={c.eye} />
        {/* escamas (arcos) mirando a la izquierda */}
        <path d={`M ${rx*0.3},0 a ${ry*0.5},${ry*0.5} 0 0 1 -${ry},0`} fill="none" stroke={c.stroke} strokeOpacity="0.35" />
        <path d={`M ${rx*0.1},-3 a ${ry*0.45},${ry*0.45} 0 0 1 -${ry*0.9},0`} fill="none" stroke={c.stroke} strokeOpacity="0.35" />
        <path d={`M ${rx*0.1},3 a ${ry*0.45},${ry*0.45} 0 0 1 -${ry*0.9},0`} fill="none" stroke={c.stroke} strokeOpacity="0.35" />
      </g>
    );
  };

  const placed = ordered.map((f, i) => {
    const y = paddingTop + i * lineGap + 100;
    return { ...f, x: fishX, y, kind: roleKind(f.role) as RoleKind };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto", border: "1px solid #eee", borderRadius: 12, background: "#FAFAFA" }}
    >
      {/* raíz a la IZQUIERDA */}
      <g>
        <line x1={rootX} y1={rootY - 200} x2={rootX} y2={rootY + 200} stroke="#94A3B8" strokeWidth={6} />
        <circle cx={rootX} cy={rootY - 210} r={8} fill="#64748B" />
        <text x={rootX} y={rootY + 230} textAnchor="middle" fontSize={13} fill="#475569">Raíz</text>
      </g>

      {/* cuerdas: ahora llegan cerca de la BOCA (x = fishX - rx - 12) */}
      {placed.map((p) => {
        const kind = p.kind as RoleKind;
        const mouthX = (p as any).x - SIZE[kind].rx - 12;
        const y = (p as any).y;
        return (
          <g key={`ln-${(p as any).id}`}>
            <line x1={rootX} y1={y} x2={mouthX} y2={y} stroke="#CBD5E1" strokeWidth={2} />
            <polyline
              points={`${rootX},${y - 8} ${rootX + 10},${y} ${rootX},${y + 8}`}
              fill="#E2E8F0"
              stroke="#94A3B8"
              strokeWidth={1}
            />
          </g>
        );
      })}

      {/* peces mirando a la IZQUIERDA */}
      {placed.map(p => (
        <g key={(p as any).id} transform={`translate(${(p as any).x}, ${(p as any).y})`}>
          {renderFish ? renderFish((p as any).kind): <Koi kind={(p as any).kind} />}
          <text x={0} y={SIZE[(p as any).kind].ry + 22} fontSize={12} textAnchor="middle" fill="#334155">
            {p.name || "—"}
            {p.role ? <tspan x="0" dy="14" fontSize="11" fill="#64748B">{labelRole(p.role)}</tspan> : null}
          </text>
        </g>
      ))}
    </svg>
  );
}
