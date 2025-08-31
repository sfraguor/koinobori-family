const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function claimToken(token: string) {
  const r = await fetch(`${API}/api/auth/consume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });
  if (!r.ok) throw new Error("Token inválido");
  return r.json() as Promise<{ session: string; familyId: string }>;
}

export async function getFamily(session: string, familyId: string) {
  const r = await fetch(`${API}/api/family/${familyId}`, {
    headers: { Authorization: `Bearer ${session}` }
  });
  if (!r.ok) throw new Error("No auth");
  return r.json();
}

export async function addFish(session: string, familyId: string, data: any) {
  const r = await fetch(`${API}/api/family/${familyId}/fish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session}`
    },
    body: JSON.stringify(data)
  });
  if (!r.ok) throw new Error("No se pudo crear el pez");
  return r.json();
}

export async function updateFish(session: string, fishId: string, data: any) {
  const r = await fetch(`${API}/api/fish/${fishId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session}`
    },
    body: JSON.stringify(data)
  });
  if (!r.ok) throw new Error("No se pudo actualizar el pez");
  return r.json();
}

export async function createInvite(session: string, familyId: string) {
  const r = await fetch(`${API}/api/family/${familyId}/invite`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session}` }
  });
  if (!r.ok) throw new Error("No se pudo crear la invitación");
  return r.json() as Promise<{ inviteUrl: string }>;
}

export async function getPublicFamily(publicId: string) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const r = await fetch(`${API}/api/public/${publicId}`);
  if (!r.ok) throw new Error("No encontrado");
  return r.json() as Promise<{ publicId:string; label?:string; fishes:any[] }>;
}


