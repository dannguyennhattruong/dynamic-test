"use client";

import {
  useDynamicContext,
  useTelegramLogin,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import MultiChainSwap from "./components/MultiChainSwap";
import { PageLayout } from "./components/ui/PageLayout";
import Spinner from "./Spinner";
import ChainPage from "./components/Home";

export default function Main() {
  const { sdkHasLoaded, user, primaryWallet } = useDynamicContext();
  const { telegramSignIn } = useTelegramLogin();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!sdkHasLoaded) return;

    const signIn = async () => {
      if (!user) {
        await telegramSignIn({ forceCreateUser: true });
      }
      setIsLoading(false);
    };

    signIn();
  }, [sdkHasLoaded, telegramSignIn, user]);

  return <PageLayout>{isLoading ? <Spinner /> : <ChainPage />}</PageLayout>;
}
