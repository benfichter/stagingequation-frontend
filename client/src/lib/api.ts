const resolveApiBase = () => {
  const explicit = import.meta.env.VITE_API_BASE;
  if (explicit && explicit.trim()) {
    return explicit;
  }
  const legacy = import.meta.env.VITE_BASE_URL;
  if (import.meta.env.PROD && legacy && legacy.trim()) {
    return legacy;
  }
  return "/api";
};

export const getApiBase = () => resolveApiBase();

export const buildApiUrl = (path: string) => {
  const base = resolveApiBase();
  const trimmed = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${trimmed}${normalized}`;
};
