"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Link as LinkIcon, RefreshCw } from "lucide-react";
import { exchangePlaidToken, getPlaidLinkToken, syncPlaidHoldings } from "@/lib/api";

interface Props {
  onSuccess: () => void;
}

export default function PlaidLinkButton({ onSuccess }: Props) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPlaidLinkToken()
      .then(setLinkToken)
      .catch(() => setError("Could not initialize brokerage connection."));
  }, []);

  const handleSuccess = useCallback(
    async (public_token: string, metadata: { institution?: { name?: string } }) => {
      setSyncing(true);
      setError("");
      try {
        await exchangePlaidToken(public_token, metadata.institution?.name ?? "");
        onSuccess();
      } catch {
        setError("Failed to sync holdings. Please try again.");
      } finally {
        setSyncing(false);
      }
    },
    [onSuccess]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess: handleSuccess,
  });

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await syncPlaidHoldings();
      onSuccess();
    } catch {
      setError("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button
        onClick={() => open()}
        disabled={!ready || !linkToken || syncing}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <LinkIcon className="h-4 w-4" />
        {syncing ? "Syncing…" : "Connect brokerage"}
      </button>
      <button
        onClick={handleManualSync}
        disabled={syncing}
        title="Refresh holdings"
        className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}
