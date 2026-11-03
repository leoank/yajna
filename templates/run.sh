#!/usr/bin/env bash
# Re-creates $id for $experiment. Run from the repo root, inside the project's dev shell,
# at the commit recorded on the run page:
#   nix develop ./code/<slug> -c $script
set -euo pipefail

# 1. Inputs and environment: pin data paths, seeds, model and tool versions here.

# 2. The command(s) that produced the result. Outputs go in the run's directory:
#    $$YAJNA_RUN_DIR when yajna runs this (yajna run shell, run reproduce), else beside this
#    script. Write nothing outside the repo except under a root recorded in the run's env.
out="$${YAJNA_RUN_DIR:-$$(dirname "$$0")}"
mkdir -p "$$out"

# 3. Metric runs print exactly one line for `yajna result`:
#    echo '===RESULT=== {"metric": 0.0}'
