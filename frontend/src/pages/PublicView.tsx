import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicFamily } from "../lib/api";
import FishTree from "../components/FishTree";
import CustomFish from "../components/CustomFish";
import RoleFish from "../components/fish/RoleFish";


type RoleKind = "parent" | "child" | "grandparent" | "other";

const LEGEND: Record<RoleKind, { label: string; fill: string; border: string }> = {
  parent: { label: "Madre/Padre", fill: "#FDE68A", border: "#F59E0B" },
  child: { label: "Hija/Hijo", fill: "#BFDBFE", border: "#3B82F6" },
  grandparent: { label: "Abuela/Abuelo", fill: "#FBCFE8", border: "#EC4899" },
  other: { label: "Otro", fill: "#BBF7D0", border: "#10B981" }
};

function roleKind(role?: string | null): RoleKind {
  if (!role) return "other";
  const r = role.toLowerCase();
  if (r.includes("madre") || r.includes("padre")) return "parent";
  if (r.startsWith("hij")) return "child";
  if (r.includes("abuelo") || r.includes("abuela")) return "grandparent";
  return "other";
}

export default function PublicView() {
  const { publicId } = useParams();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (!publicId) return;
    (async () => {
      try { setData(await getPublicFamily(publicId)); }
      catch (e: any) { setErr(e?.message || "Error"); }
    })();
  }, [publicId]);

  const usedKinds = useMemo(() => {
    if (!data?.fishes) return new Set<RoleKind>();
    return new Set<RoleKind>(data.fishes.map((f: any) => roleKind(f.role)));
  }, [data]);

  if (err) return <main style={{ padding: 24 }}>No encontrado.</main>;
  if (!data) return <main style={{ padding: 24 }}>Cargando…</main>;

  return (
    <main style={{ maxWidth: 960, margin: "2rem auto", padding: 16 }}>
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Árbol familiar con peces</h1>
        <p style={{ color: "#666", marginTop: 4 }}>{data?.label ?? publicId}</p>
      </header>

      <FishTree fishes={data.fishes} renderFish={(kind) => <RoleFish kind={kind} />}/>

      {/* leyenda (solo las categorías presentes) */}
      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[..."parent child grandparent other".split(" ")].map(k => {
          const kk = k as RoleKind;
          if (!usedKinds.has(kk)) return null;
          const s = LEGEND[kk];
          return (
            <span key={kk}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: `1px solid ${s.border}`,
                background: s.fill,
                padding: "4px 8px",
                borderRadius: 999,
                fontSize: 12
              }}>
              <span style={{ width: 10, height: 10, background: s.border, borderRadius: "50%" }} />
              {s.label}
            </span>
          );
        })}
      </div>

      <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        Vista pública (solo lectura).
      </p>
    </main>
  );
}
