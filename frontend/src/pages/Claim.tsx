import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { claimToken } from "../lib/api";

export default function Claim() {
  const [sp] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    const token = sp.get("token");
    if (!token) return;
    (async () => {
      try {
        const { session, familyId } = await claimToken(token);
        localStorage.setItem("session", session);
        nav(`/family/${familyId}`);
      } catch {
        alert("Token inválido");
      }
    })();
  }, [sp]);

  return <main style={{ padding: 24 }}>Validando acceso…</main>;
}
