

export const domain = 'http://localhost:3000'

export const decodeJWT = (token) => {
    if (!token) {
        throw new Error("No token provided");
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error("JWT must have 3 parts");
    }

    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));

    return decodedPayload;
}
