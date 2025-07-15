
export function safeJsonParse<T>(jsonString: string): [T | null, Error | null] {
  try {
    let text = jsonString.trim();
    // Handle cases where the API wraps the JSON in markdown code fences
    if (text.startsWith('```json')) {
      text = text.slice(7, -3).trim();
    } else if (text.startsWith('```')) {
      text = text.slice(3, -3).trim();
    }
    const data: T = JSON.parse(text);
    return [data, null];
  } catch (error) {
    if (error instanceof Error) {
        return [null, error];
    }
    return [null, new Error("An unknown error occurred during JSON parsing.")];
  }
}
