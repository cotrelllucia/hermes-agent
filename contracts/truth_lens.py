# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json
import typing


class TruthLens(gl.Contract):
    claims: TreeMap[u256, DynArray[u8]]
    claim_count: u256
    owner: Address

    def __init__(self):
        self.claim_count = u256(0)
        self.owner = gl.message.sender

    @gl.public.write
    def verify_claim(self, claim_text: str, source_url: str) -> None:
        """
        Submit a claim for AI-powered verification.
        The contract fetches the source URL, analyzes it with an LLM,
        and stores the verdict on-chain.
        """
        claim_id = self.claim_count

        def leader_fn():
            web_response = gl.nondet.web.get(source_url)
            page_content = web_response.body.decode("utf-8")[:4000]

            prompt = f"""You are a fact-checking AI. Analyze whether the following claim is supported by the provided web page content.

Claim: {claim_text}

Web page content from {source_url}:
{page_content}

Respond ONLY with a JSON object in this exact format:
{{
    "verdict": "SUPPORTED" or "REFUTED" or "INSUFFICIENT_EVIDENCE",
    "confidence": integer from 1 to 100,
    "reasoning": "brief explanation (max 200 chars)"
}}

Output only valid JSON, no markdown formatting."""

            result = gl.nondet.exec_prompt(prompt)
            backticks = "``" + "`"
            result = result.replace(backticks + "json", "").replace(backticks, "").strip()
            parsed = json.loads(result)
            return parsed

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            leader_data = leader_result.calldata
            if not isinstance(leader_data, dict):
                return False
            if leader_data.get("verdict") not in ("SUPPORTED", "REFUTED", "INSUFFICIENT_EVIDENCE"):
                return False
            if not isinstance(leader_data.get("confidence"), int):
                return False
            if not (1 <= leader_data["confidence"] <= 100):
                return False

            validator_data = leader_fn()
            return leader_data["verdict"] == validator_data["verdict"]

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        claim_record = json.dumps({
            "id": int(claim_id),
            "claim": claim_text,
            "source_url": source_url,
            "verdict": result["verdict"],
            "confidence": result["confidence"],
            "reasoning": result["reasoning"],
            "submitter": str(gl.message.sender),
        })

        self.claims[claim_id] = DynArray[u8](claim_record.encode("utf-8"))
        self.claim_count = u256(int(claim_id) + 1)

    @gl.public.write
    def verify_claim_multi_source(self, claim_text: str) -> None:
        """
        Submit a claim for verification using multiple web sources.
        The contract searches for relevant information and cross-references.
        """
        claim_id = self.claim_count

        search_url = f"https://www.google.com/search?q={claim_text.replace(' ', '+')}"

        def leader_fn():
            web_response = gl.nondet.web.render(search_url, mode="text")
            search_content = web_response[:4000] if isinstance(web_response, str) else web_response.decode("utf-8")[:4000]

            prompt = f"""You are a fact-checking AI. Based on the search results below, determine if the following claim is true.

Claim: {claim_text}

Search results:
{search_content}

Respond ONLY with a JSON object in this exact format:
{{
    "verdict": "SUPPORTED" or "REFUTED" or "INSUFFICIENT_EVIDENCE",
    "confidence": integer from 1 to 100,
    "reasoning": "brief explanation (max 200 chars)",
    "sources_found": integer number of relevant sources identified
}}

Output only valid JSON, no markdown formatting."""

            result = gl.nondet.exec_prompt(prompt)
            backticks = "``" + "`"
            result = result.replace(backticks + "json", "").replace(backticks, "").strip()
            parsed = json.loads(result)
            return parsed

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            leader_data = leader_result.calldata
            if not isinstance(leader_data, dict):
                return False
            if leader_data.get("verdict") not in ("SUPPORTED", "REFUTED", "INSUFFICIENT_EVIDENCE"):
                return False

            validator_data = leader_fn()
            return leader_data["verdict"] == validator_data["verdict"]

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        claim_record = json.dumps({
            "id": int(claim_id),
            "claim": claim_text,
            "source_url": "multi-source-search",
            "verdict": result["verdict"],
            "confidence": result["confidence"],
            "reasoning": result["reasoning"],
            "sources_found": result.get("sources_found", 0),
            "submitter": str(gl.message.sender),
        })

        self.claims[claim_id] = DynArray[u8](claim_record.encode("utf-8"))
        self.claim_count = u256(int(claim_id) + 1)

    @gl.public.view
    def get_claim(self, claim_id: int) -> str:
        """Get a specific claim verification result."""
        key = u256(claim_id)
        data = self.claims.get(key, None)
        if data is None:
            return json.dumps({"error": "Claim not found"})
        return bytes(data).decode("utf-8")

    @gl.public.view
    def get_claim_count(self) -> int:
        """Get total number of verified claims."""
        return int(self.claim_count)

    @gl.public.view
    def get_recent_claims(self, count: int) -> str:
        """Get the most recent N claim verifications."""
        total = int(self.claim_count)
        start = max(0, total - count)
        results = []
        for i in range(start, total):
            key = u256(i)
            data = self.claims.get(key, None)
            if data is not None:
                results.append(json.loads(bytes(data).decode("utf-8")))
        return json.dumps(results)
