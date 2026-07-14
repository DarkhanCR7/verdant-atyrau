export async function logoutFromAdmin(router?: { replace: (url: string) => void; refresh: () => void }) {
  const target = "/admin/login";

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignore fetch failures and fall back to a hard redirect below.
  }

  if (typeof window !== "undefined") {
    window.location.assign(target);
    return;
  }

  router?.replace(target);
  router?.refresh();
}
