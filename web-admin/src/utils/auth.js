export function getToken() {
  const token = localStorage.getItem("token");
  return token;
};

export function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export async function loginUser(credentials) {
  const res = await fetch("http://localhost:8000/api/v1/mobile/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    // misalnya backend balikin { message: "Invalid credentials" }
    const err = await res.json();
    throw new Error(err.message || "Login gagal");
  }

  return res.json();
}

export async function logoutUser() {
  try {
    const res = await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Logout gagal di server");
    }
  } catch (err) {
    console.error("Gagal logout ke server:", err);
  } finally {
    // tetap hapus token di localStorage walaupun API gagal
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export function hasRole(roles) {
    const user = getUser();
    if (!user) return false;
    return roles.includes(user.role);
}