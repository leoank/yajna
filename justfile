default:
  @just --list

nbs:
  pueue add 'jupyter lab --no-browser --ip=0.0.0.0 --NotebookApp.token=""'
