export function getToken() {
    return localStorage.getItem("token");
}

export function getUser() {
    const user = localStoragee.getItem("user");
    return user ? JSON.parse(user) : null;
}

export function loginUser(data) {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
}

export function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function hasRole(roles) {
    const user = getUser();
    if (!user) return false;
    return roles.includes(user.role);
}