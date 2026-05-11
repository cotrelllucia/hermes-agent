import json
import pytest
from gltest import ContractTest


@pytest.fixture
def contract_test():
    return ContractTest("contracts/truth_lens.py")


class TestTruthLensContract:
    """Integration tests for the TruthLens fact-checking contract."""

    def test_contract_schema(self, contract_test):
        """Test that the contract schema is generated correctly."""
        schema = contract_test.get_schema()

        assert "verify_claim" in schema["write_methods"]
        assert "verify_claim_multi_source" in schema["write_methods"]
        assert "get_claim" in schema["view_methods"]
        assert "get_claim_count" in schema["view_methods"]
        assert "get_recent_claims" in schema["view_methods"]

    def test_initial_state(self, contract_test):
        """Test that the contract initializes with zero claims."""
        contract_test.deploy([])
        result = contract_test.call_view("get_claim_count")
        assert result == 0

    def test_get_nonexistent_claim(self, contract_test):
        """Test querying a claim that doesn't exist."""
        contract_test.deploy([])
        result = contract_test.call_view("get_claim", claim_id=999)
        parsed = json.loads(result)
        assert parsed.get("error") == "Claim not found"

    def test_verify_claim_with_source(self, contract_test):
        """Test verifying a claim with a specific source URL."""
        contract_test.deploy([])

        contract_test.call_write(
            "verify_claim",
            claim_text="Python is a programming language",
            source_url="https://www.python.org/",
        )

        count = contract_test.call_view("get_claim_count")
        assert count == 1

        claim = contract_test.call_view("get_claim", claim_id=0)
        parsed = json.loads(claim)
        assert parsed["claim"] == "Python is a programming language"
        assert parsed["verdict"] in ("SUPPORTED", "REFUTED", "INSUFFICIENT_EVIDENCE")
        assert 1 <= parsed["confidence"] <= 100
        assert "reasoning" in parsed

    def test_verify_multiple_claims(self, contract_test):
        """Test submitting multiple claims for verification."""
        contract_test.deploy([])

        contract_test.call_write(
            "verify_claim",
            claim_text="The Earth orbits the Sun",
            source_url="https://science.nasa.gov/solar-system/",
        )

        contract_test.call_write(
            "verify_claim",
            claim_text="Water boils at 100 degrees Celsius at sea level",
            source_url="https://en.wikipedia.org/wiki/Boiling_point",
        )

        count = contract_test.call_view("get_claim_count")
        assert count == 2

    def test_get_recent_claims(self, contract_test):
        """Test retrieving recent claims."""
        contract_test.deploy([])

        contract_test.call_write(
            "verify_claim",
            claim_text="Python was created by Guido van Rossum",
            source_url="https://www.python.org/",
        )

        recent = contract_test.call_view("get_recent_claims", count=5)
        parsed = json.loads(recent)
        assert len(parsed) == 1
        assert parsed[0]["claim"] == "Python was created by Guido van Rossum"

    def test_verify_claim_multi_source(self, contract_test):
        """Test multi-source verification."""
        contract_test.deploy([])

        contract_test.call_write(
            "verify_claim_multi_source",
            claim_text="GenLayer is a blockchain platform",
        )

        count = contract_test.call_view("get_claim_count")
        assert count == 1

        claim = contract_test.call_view("get_claim", claim_id=0)
        parsed = json.loads(claim)
        assert parsed["source_url"] == "multi-source-search"
        assert parsed["verdict"] in ("SUPPORTED", "REFUTED", "INSUFFICIENT_EVIDENCE")
