---
id: PRO-0001
type: protocol
schema_version: 1
title: Plasmid miniprep on a spin column
version: 1
stage: codified           # text | codified
source: notes/protocols/PRO-0001/protocol.py
kind: bench               # bench | assembly | compute
status: draft             # draft | active | deprecated
created: 2026-11-17
author: agent:claude-yajna-protocol-framework
materials: [MAT-0001, MAT-0002, MAT-0003, MAT-0004, MAT-0005, MAT-0006]
equipment: [EQP-0001, EQP-0002]
tags: [dna, cloning]
review: pending
---

## Purpose
Plasmid DNA from 2 mL of an overnight E. coli culture by alkaline lysis and a silica spin
column, enough for sequencing, digests and cloning.

This page is the example of a codified protocol: everything under *Steps* is generated
from `notes/protocols/PRO-0001/protocol.py` by `yajna-protocol page`. Change the code and
regenerate; do not edit the steps here.

## Materials
- [[MAT-0001]] or another overnight culture: the `culture` parameter
- [[MAT-0002]], [[MAT-0003]], [[MAT-0004]]: resuspension, lysis and neutralisation
- [[MAT-0005]] and [[MAT-0006]]: column wash and elution
- Spin columns with collection tubes, 2 mL and 1.5 mL tubes

## Steps
### Harvest
1. Label 2 mL tubes T1, T2, T3, T4. {key: harvest.1}
2. Add 2 mL of overnight culture [[MAT-0001]] to T1, T2, T3, T4. {materials: [MAT-0001], volume: 2mL, keys: ["harvest.culture[T1]", "harvest.culture[T2]", "harvest.culture[T3]", "harvest.culture[T4]"]}
3. Centrifuge T1, T2, T3, T4 at 6800 x g for 3 min in Microcentrifuge [[EQP-0001]]. {duration: 3m, wait: true, equipment: [EQP-0001], key: harvest.2}
4. Discard the supernatant from T1, T2, T3, T4, keeping the pellet. {keys: ["harvest.3[T1]", "harvest.3[T2]", "harvest.3[T3]", "harvest.3[T4]"]}

### Lyse
5. Resuspend the pellet in T1, T2, T3, T4 in 250 uL of Resuspension buffer with RNase A [[MAT-0002]] by pipetting up and down. {materials: [MAT-0002], volume: 250uL, check: "no clumps left", keys: ["lyse.resuspend[T1]", "lyse.resuspend[T2]", "lyse.resuspend[T3]", "lyse.resuspend[T4]"]}
6. Add 250 uL of Lysis buffer [[MAT-0003]] to T1, T2, T3, T4. {materials: [MAT-0003], volume: 250uL, keys: ["lyse.lysis[T1]", "lyse.lysis[T2]", "lyse.lysis[T3]", "lyse.lysis[T4]"]}
7. Invert T1, T2, T3, T4 6 times. {check: "lysate clear and viscous; no more than 5 min in lysis buffer", hazard: "lysis buffer is caustic", key: lyse.1}
8. Add 350 uL of Neutralisation buffer [[MAT-0004]] to T1, T2, T3, T4. {materials: [MAT-0004], volume: 350uL, keys: ["lyse.neutralise[T1]", "lyse.neutralise[T2]", "lyse.neutralise[T3]", "lyse.neutralise[T4]"]}
9. Invert T1, T2, T3, T4 6 times. {key: lyse.2}
10. Centrifuge T1, T2, T3, T4 at 17900 x g for 10 min in Microcentrifuge [[EQP-0001]]. {duration: 10m, wait: true, equipment: [EQP-0001], key: lyse.clear}
11. Check: white flakes in the supernatant. {check: "white flakes in the supernatant", key: lyse.flakes}
12. Decision: if white flakes in the supernatant, do step 13; otherwise skip them. {key: lyse.3}
13. If white flakes in the supernatant (step 12): Centrifuge T1, T2, T3, T4 at 17900 x g for 5 min in Microcentrifuge [[EQP-0001]]. {duration: 5m, wait: true, equipment: [EQP-0001], key: lyse.4}

### Bind and wash
14. Label spin columns C1, C2, C3, C4. {key: bind_and_wash.1}
15. Transfer 800 uL from T1 to C1. {volume: 800uL, key: "bind_and_wash.load[C1]"}
16. Transfer 800 uL from T2 to C2. {volume: 800uL, key: "bind_and_wash.load[C2]"}
17. Transfer 800 uL from T3 to C3. {volume: 800uL, key: "bind_and_wash.load[C3]"}
18. Transfer 800 uL from T4 to C4. {volume: 800uL, key: "bind_and_wash.load[C4]"}
19. Centrifuge C1, C2, C3, C4 at 17900 x g for 1 min in Microcentrifuge [[EQP-0001]]. {duration: 1m, wait: true, equipment: [EQP-0001], key: bind_and_wash.2}
20. Discard the flow-through and put each column back in its collection tube. {key: bind_and_wash.3}
21. Add 750 uL of Column wash buffer [[MAT-0005]] to C1, C2, C3, C4. {materials: [MAT-0005], volume: 750uL, keys: ["bind_and_wash.wash[C1]", "bind_and_wash.wash[C2]", "bind_and_wash.wash[C3]", "bind_and_wash.wash[C4]"]}
22. Centrifuge C1, C2, C3, C4 at 17900 x g for 1 min in Microcentrifuge [[EQP-0001]]. {duration: 1m, wait: true, equipment: [EQP-0001], key: bind_and_wash.4}
23. Discard the flow-through and put each column back in its collection tube. {key: bind_and_wash.5}
24. Centrifuge C1, C2, C3, C4 at 17900 x g for 1 min in Microcentrifuge [[EQP-0001]]. {duration: 1m, wait: true, equipment: [EQP-0001], check: "column dry; no ethanol left on the rim", key: bind_and_wash.dry}

### Elute
25. Label 1.5 mL tubes E1, E2, E3, E4. {key: elute.1}
26. Seat each column in its eluate tube, C1 in E1 and so on. {key: elute.2}
27. Add 50 uL of Elution buffer [[MAT-0006]] to C1, C2, C3, C4. {materials: [MAT-0006], volume: 50uL, check: "buffer on the centre of the membrane", keys: ["elute.elute[C1]", "elute.elute[C2]", "elute.elute[C3]", "elute.elute[C4]"]}
28. Wait for 1 min: let the buffer soak the membrane. {duration: 1m, wait: true, key: elute.3}
29. Centrifuge C1, C2, C3, C4 at 17900 x g for 1 min in Microcentrifuge [[EQP-0001]]. {duration: 1m, wait: true, equipment: [EQP-0001], key: elute.4}
30. Measure concentration of E1 on Microvolume spectrophotometer [[EQP-0002]] in ng/uL and record it. {equipment: [EQP-0002], measure: concentration, record: true, key: "elute.yield[E1]"}
31. Measure concentration of E2 on Microvolume spectrophotometer [[EQP-0002]] in ng/uL and record it. {equipment: [EQP-0002], measure: concentration, record: true, key: "elute.yield[E2]"}
32. Measure concentration of E3 on Microvolume spectrophotometer [[EQP-0002]] in ng/uL and record it. {equipment: [EQP-0002], measure: concentration, record: true, key: "elute.yield[E3]"}
33. Measure concentration of E4 on Microvolume spectrophotometer [[EQP-0002]] in ng/uL and record it. {equipment: [EQP-0002], measure: concentration, record: true, key: "elute.yield[E4]"}
34. Safe stopping point: store the eluates at -20 C. {checkpoint: "store the eluates at -20 C", key: elute.5}

## Notes
- v1: first version, written as code. Parameters: `culture` (a strain), `n` cultures (1 to
  24, default 4), `elute_ul` (30 to 100 uL, default 50). The steps above are the render for
  the defaults; `yajna-protocol render notes/protocols/PRO-0001/protocol.py -p n=12` shows
  them for twelve.
