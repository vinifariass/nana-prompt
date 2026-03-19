import { SuccessClient } from "./SuccessClient";

interface PageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const plan = (params.plan ?? "CREATOR").toUpperCase();
  return <SuccessClient plan={plan} />;
}
