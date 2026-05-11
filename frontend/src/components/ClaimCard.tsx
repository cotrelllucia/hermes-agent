import type { Claim } from "@/lib/types";

interface ClaimCardProps {
  claim: Claim;
}

function getVerdictStyle(verdict: Claim["verdict"]) {
  switch (verdict) {
    case "SUPPORTED":
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-100 text-green-800",
        icon: "check-circle",
      };
    case "REFUTED":
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800",
        icon: "x-circle",
      };
    case "INSUFFICIENT_EVIDENCE":
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-800",
        icon: "alert-circle",
      };
  }
}

function getVerdictLabel(verdict: Claim["verdict"]) {
  switch (verdict) {
    case "SUPPORTED":
      return "Supported";
    case "REFUTED":
      return "Refuted";
    case "INSUFFICIENT_EVIDENCE":
      return "Insufficient Evidence";
  }
}

export function ClaimCard({ claim }: ClaimCardProps) {
  const style = getVerdictStyle(claim.verdict);

  return (
    <div
      className={`rounded-xl border ${style.border} ${style.bg} p-5 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-900 font-medium text-lg mb-2">
            &ldquo;{claim.claim}&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${style.badge}`}
            >
              {getVerdictLabel(claim.verdict)}
            </span>
            <span className="text-sm text-gray-500">
              Confidence: {claim.confidence}%
            </span>
            {claim.sources_found !== undefined && (
              <span className="text-sm text-gray-500">
                Sources: {claim.sources_found}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2">{claim.reasoning}</p>

          {claim.source_url !== "multi-source-search" && (
            <a
              href={claim.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:underline break-all"
            >
              Source: {claim.source_url}
            </a>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200/50 flex items-center justify-between text-xs text-gray-400">
        <span>Claim #{claim.id}</span>
        <span className="font-mono truncate max-w-[200px]">
          {claim.submitter}
        </span>
      </div>
    </div>
  );
}
