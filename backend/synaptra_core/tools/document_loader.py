from pathlib import Path


def load_document(path: str) -> str:
    """
    Loads a text document from disk.
    Later this will handle PDFs, DOCX, etc.
    """
    p = Path(path)
    if not p.exists():
        return f"Document not found: {path}"
    return p.read_text(encoding="utf-8", errors="ignore")
