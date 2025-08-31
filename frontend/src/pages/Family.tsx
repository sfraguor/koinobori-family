import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFamily, addFish, updateFish, createInvite } from "../lib/api";
import FishTree from "../components/FishTree";
import CustomFish from "../components/CustomFish";
import RoleFish from "../components/fish/RoleFish";


export default function Family() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const session = localStorage.getItem("session") || "";

  const load = async () => {
    if (!id || !session) return;
    setLoading(true);
    try {
      const fam = await getFamily(session, id);
      setData(fam);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id, session]);

  // ⚠️ Guardas tempranas: NO renderizar nada que use `data` antes de esto
  if (!session) return <main style={{ padding: 24 }}>Accede desde tu enlace (QR): /claim?token=…</main>;
  if (!data)    return <main style={{ padding: 24 }}>Cargando…</main>;

  // ✅ A partir de aquí `data` no es null
  const publicUrl = data.publicId ? `${window.location.origin}/v/${data.publicId}` : null;

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: 16 }}>
      <h1>Árbol familiar con peces</h1>
      <p style={{ color: "#666" }}>{data?.label ?? id}</p>

      <FishTree fishes={data.fishes} renderFish={(kind) => <RoleFish kind={kind} />}/>

      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={async () => {
            await addFish(session, id!, { name: "Nuevo pez" });
            await load();
          }}
        >
          Añadir pez
        </button>

        <button
          onClick={async () => {
            try {
              const { inviteUrl } = await createInvite(session, id!);
              try {
                await navigator.clipboard.writeText(inviteUrl);
                alert("Enlace de invitación copiado: " + inviteUrl);
              } catch {
                prompt("Copia este enlace de invitación:", inviteUrl);
              }
            } catch (e: any) {
              alert(e?.message || "No se pudo crear la invitación");
            }
          }}
        >
          Crear enlace de invitación
        </button>

        {/* Botón seguro: solo usa publicId si existe */}
        <button
          onClick={async () => {
            if (!publicUrl) {
              alert("Este árbol aún no tiene enlace público. Crea familia nueva o rellena publicId en Studio / script.");
              return;
            }
            try {
              await navigator.clipboard.writeText(publicUrl);
              alert("Enlace público copiado: " + publicUrl);
            } catch {
              prompt("Copia este enlace público:", publicUrl);
            }
          }}
        >
          Copiar enlace público
        </button>

        {loading && <span style={{ color: "#999" }}>Actualizando…</span>}
      </div>

      {/* Lista para renombrar + rol (opcional) */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Renombrar y roles</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {data.fishes.map((f: any) => (
            <div key={f.id} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input
                defaultValue={f.name ?? ""}
                placeholder="Nombre del pez"
                onBlur={async (e) => {
                  const name = e.currentTarget.value;
                  if (name !== (f.name ?? "")) {
                    await updateFish(session, f.id, { name });
                    await load();
                  }
                }}
                style={{ padding: "6px 8px" }}
              />
              <select
                defaultValue={f.role ?? ""}
                onChange={async (e) => {
                  await updateFish(session, f.id, { role: e.target.value || null });
                  await load();
                }}
                style={{ padding: "6px 8px" }}
              >
                <option value="">(sin rol)</option>
                <option value="madre">Madre</option>
                <option value="padre">Padre</option>
                <option value="hija">Hija</option>
                <option value="hijo">Hijo</option>
                <option value="abuela">Abuela</option>
                <option value="abuelo">Abuelo</option>
                <option value="tía">Tía</option>
                <option value="tío">Tío</option>
                <option value="prima">Prima</option>
                <option value="primo">Primo</option>
              </select>
              <small style={{ color: "#999" }}>{f.id.slice(0, 6)}…</small>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
