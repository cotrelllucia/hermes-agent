"use client";

import { useState } from "react";

interface ClaimFormProps {
  onSubmit: (claimText: string, sourceUrl: string | null) => Promise<void>;
  submitting: boolean;
}

export function ClaimForm({ onSubmit, submitting }: ClaimFormProps) {
  const [claimText, setClaimText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [useMultiSource, setUseMultiSource] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimText.trim()) return;
    await onSubmit(claimText.trim(), useMultiSource ? null : sourceUrl.trim());
    setClaimText("");
    setSourceUrl("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Verify a Claim
      </h2>

      <div className="mb-4">
        <label
          htmlFor="claim"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Claim to verify
        </label>
        <textarea
          id="claim"
          value={claimText}
          onChange={(e) => setClaimText(e.target.value)}
          placeholder='e.g., "Python was created by Guido van Rossum in 1991"'
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
          disabled={submitting}
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useMultiSource}
            onChange={(e) => setUseMultiSource(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            disabled={submitting}
          />
          <span className="text-sm text-gray-700">
            Auto-search multiple sources (no URL needed)
          </span>
        </label>
      </div>

      {!useMultiSource && (
        <div className="mb-4">
          <label
            htmlFor="source"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Source URL
          </label>
          <input
            id="source"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={submitting}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={
          submitting || !claimText.trim() || (!useMultiSource && !sourceUrl.trim())
        }
        className="w-full py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Verifying with AI consensus...
          </span>
        ) : (
          "Verify Claim"
        )}
      </button>
    </form>
  );
}
