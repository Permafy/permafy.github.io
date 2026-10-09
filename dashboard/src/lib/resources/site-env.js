import { env } from "$env/dynamic/public";

const getPublicEnv = (key, fallback) => {
    const value = env?.[key];
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

export const PUBLIC_API_URL = getPublicEnv(
    "PUBLIC_API_URL",
    "https://projects.penguinmod.com",
);

export const PUBLIC_STUDIO_URL = getPublicEnv(
    "PUBLIC_STUDIO_URL",
    "https://studio.penguinmod.com",
);

export const PUBLIC_BASIC_API_URL = getPublicEnv(
    "PUBLIC_BASIC_API_URL",
    "https://penguinmod-basic-api.derpygamer2142.com",
);
