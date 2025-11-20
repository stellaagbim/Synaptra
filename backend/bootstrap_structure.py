from pathlib import Path


STRUCTURE = {
    "synaptra_core/__init__.py": "",
    "synaptra_core/config.py": "",
    "synaptra_core/agent/__init__.py": "",
    "synaptra_core/agent/controller.py": "",
    "synaptra_core/agent/planner.py": "",
    "synaptra_core/agent/memory.py": "",
    "synaptra_core/agent/tool_registry.py": "",
    "synaptra_core/agent/logger.py": "",
    "synaptra_core/tools/__init__.py": "",
    "synaptra_core/tools/browser.py": "",
    "synaptra_core/tools/document_loader.py": "",
    "synaptra_core/api/__init__.py": "",
    "synaptra_core/db/__init__.py": "",
    "synaptra_core/queue/__init__.py": "",
}


def main() -> None:
    root = Path(__file__).parent
    for rel_path, contents in STRUCTURE.items():
        file_path = root / rel_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        if not file_path.exists():
            file_path.write_text(contents)
            print(f"Created {file_path}")
        else:
            print(f"Skipped existing {file_path}")


if __name__ == "__main__":
    main()
