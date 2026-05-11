"use client";

import { useState, useEffect } from "react";
import { ClaimForm } from "@/components/ClaimForm";
import { ClaimCard } from "@/components/ClaimCard";
import { Header } from "@/components/Header";
import { getContract } from "@/lib/genlayer";
import type { Claim } from "@/lib/types";

export default function Home() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const contract = getContract();
      const result = await contract.read("get_recent_claims", [10]);
      const parsed: Claim[] = JSON.parse(result as string);
      setClaims(parsed.reverse());
    } catch (error) {
      console.error("Failed to fetch claims:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleSubmitClaim = async (
    claimText: string,
    sourceUrl: string | null
  ) => {
    setSubmitting(true);
    try {
      const contract = getContract();
      if (sourceUrl) {
        await contract.write("verify_claim", [claimText, sourceUrl]);
      } else {
        await contract.write("verify_claim_multi_source", [claimText]);
      }
      await fetchClaims();
    } catch (error) {
      console.error("Failed to submit claim:", error);
      alert("Failed to verify claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <Header />

      <section className="mb-8">
        <ClaimForm onSubmit={handleSubmitClaim} submitting={submitting} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Recent Verifications
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No claims verified yet. Submit the first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
