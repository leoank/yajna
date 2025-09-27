# Agent Instructions for Yajna

## Commands
- **Install**: `uv sync --extra dev`
- **Build**: `uv build`
- **Test all**: `uv run pytest`
- **Test single**: `uv run pytest yajna/path/to/test_file.py::test_function` or `uv run pytest sspoc/path/to/test_file.py::test_function`
- **Lint**: `uv run ruff check .`
- **Format**: `uv run ruff format .`
- **Type check**: `uv run mypy yajna/src/` or `uv run mypy sspoc/src/`

## Code Style
- **Imports**: Standard library first, then third-party, then local. Use absolute imports.
- **Types**: Use type hints for all function parameters and return values.
- **Naming**: snake_case for functions/variables, PascalCase for classes, UPPER_CASE for constants.
- **Error handling**: Use specific exceptions, avoid bare except clauses.
- **Docstrings**: Use triple quotes with brief description for all public functions.
- **Formatting**: Follow ruff's default formatting (4 spaces, 88 char line length).
- **Dependencies**: Check yajna/pyproject.toml or sspoc/pyproject.toml before adding new dependencies.

## Packages
- **yajna**: Main application package
- **sspoc**: Sparse Sensor Placement Optimization for Classification package