import { Badge } from "@/components/ui/badge";
import { CreditState } from "@/lib/types";

export function CreditBadge({ credits }: { credits: CreditState }) {
  const remaining = credits.limit - credits.used;
  const isLow = remaining <= 1 && !credits.isLoggedIn;

  return (
    <Badge variant={isLow ? "destructive" : "secondary"} className="text-xs">
      {credits.isLoggedIn
        ? `${remaining} searches today`
        : `${remaining} free ${remaining === 1 ? "search" : "searches"} left`}
    </Badge>
  );
}
