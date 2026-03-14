interface NewsletterPayload {
  email: string;
  company?: string;
}

interface NewsletterResponse {
  status: string;
  message: string;
  customerId?: string | null;
}

export async function subscribeToNewsletter(payload: NewsletterPayload): Promise<NewsletterResponse> {
  const response = await fetch("/api/newsletter.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.detail || "Newsletter signup failed.");
  }

  return data;
}
