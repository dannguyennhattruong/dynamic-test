"use client";

import {
  useDynamicContext,
  useTelegramLogin,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";

export function TelegramAutoLoginProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sdkHasLoaded, user } = useDynamicContext();
  const { telegramSignIn } = useTelegramLogin();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sdkHasLoaded) return;

    const login = async () => {
      try {
        if (!user) {
          await telegramSignIn({
            forceCreateUser: true,
          });
        }
      } catch (err) {
        console.error("Telegram auto login failed", err);
      } finally {
        setLoading(false);
      }
    };

    login();
  }, [sdkHasLoaded, user, telegramSignIn]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <p>Logging in with Telegram...</p>
      </div>
    );
  }

  return <>{children}</>;
}
