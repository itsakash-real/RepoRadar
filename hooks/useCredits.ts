import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { CreditState } from "@/lib/types";

function getTodayKey(userId: string): string {
  const today = new Date().toISOString().split("T")[0];
  return `rr_user_${userId}_${today}`;
}

export function useCredits() {
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState<CreditState>({
    used: 0,
    limit: 5,
    isLoggedIn: false,
    canSearch: true,
  });

  const loadCredits = useCallback(() => {
    if (!isLoaded) return;

    if (user) {
      const key = getTodayKey(user.id);
      const used = parseInt(localStorage.getItem(key) ?? "0", 10);
      setCredits({ used, limit: 50, isLoggedIn: true, canSearch: used < 50 });
    } else {
      const used = parseInt(localStorage.getItem("rr_anon_used") ?? "0", 10);
      setCredits({ used, limit: 5, isLoggedIn: false, canSearch: used < 5 });
    }
  }, [user, isLoaded]);

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  const consumeCredit = useCallback(() => {
    if (!isLoaded) return;

    if (user) {
      const key = getTodayKey(user.id);
      const current = parseInt(localStorage.getItem(key) ?? "0", 10);
      const next = current + 1;
      localStorage.setItem(key, String(next));
      setCredits((prev) => ({ ...prev, used: next, canSearch: next < 50 }));
    } else {
      const current = parseInt(localStorage.getItem("rr_anon_used") ?? "0", 10);
      const next = current + 1;
      localStorage.setItem("rr_anon_used", String(next));
      setCredits((prev) => ({ ...prev, used: next, canSearch: next < 5 }));
    }
  }, [user, isLoaded]);

  return { credits, consumeCredit, loadCredits };
}
