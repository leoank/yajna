#!/usr/bin/env bash
# Re-creates $id for $experiment. Run from the repo root, inside the project's dev shell,
# at the commit recorded on the run page:
#   nix develop ./projects/<slug> -c $script
set -euo pipefail

# 1. Inputs and environment: pin data paths, seeds, model and tool versions here.

# 2. The command(s) that produced the result, writing outputs next to this script.

# 3. Metric runs print exactly one line for `yajna result`:
#    echo '===RESULT=== {"metric": 0.0}'
