export const normalizeBasePath = basePath => {
    if (!basePath || basePath === '.' || basePath === './') return '/';
    return basePath.endsWith('/') ? basePath : `${basePath}/`;
};

export default normalizeBasePath;
