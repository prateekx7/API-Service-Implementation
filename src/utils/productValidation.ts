const MAX_URL_LENGTH = 2048;

export function isValidUrl(url: string): boolean {
  if (url.length > MAX_URL_LENGTH) {
    return false;
  }

  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:"
    );
  } catch {
    return false;
  }
}

export function validateUrlArray(
  urls: unknown,
  fieldName: string
): string | null {
  if (urls === undefined) {
    return null;
  }

  if (!Array.isArray(urls)) {
    return `${fieldName} must be an array`;
  }

  if (urls.length > 20) {
    return `${fieldName} can contain at most 20 URLs`;
  }

  for (const url of urls) {
    if (
      typeof url !== "string" ||
      !isValidUrl(url)
    ) {
      return `Invalid URL in ${fieldName}`;
    }
  }

  return null;
}