### Prepare
1. Set water bath [[EQP-0004]] to 42 C. {duration: 15m, parallel: true, equipment: [EQP-0004], temp: 42C, key: prepare.1}
2. Thaw competent cells [[MAT-0210]] on ice for 10 min. {duration: 10m, materials: [MAT-0210], check: "cells fully thawed, no clumps", key: prepare.2}
3. Label 1.5 mL tubes T1, T2. {key: prepare.3}
4. Add 50 uL of competent cells [[MAT-0210]] to T1, T2, on ice. Pipette gently, do not vortex. {materials: [MAT-0210], volume: 50uL, keys: ["prepare.add_cells[T1]", "prepare.add_cells[T2]"]}
5. Add 1 uL of plasmid [[MAT-0198]] to T1, T2. Mix by flicking. {materials: [MAT-0198], volume: 1uL, keys: ["prepare.add_dna[T1]", "prepare.add_dna[T2]"]}
6. Incubate T1, T2 on ice for 30 min. {duration: 30m, wait: true, key: prepare.4}

### Heat shock
7. Heat shock T1, T2 in water bath [[EQP-0004]] at 42 C for 45 s. {duration: 45s, equipment: [EQP-0004], temp: 42C, check: "all tubes fully submerged", key: heat_shock.heat_shock}
8. Incubate T1, T2 on ice for 2 min. {duration: 2m, wait: true, key: heat_shock.1}
9. Add 950 uL of SOC [[MAT-0042]] to T1, T2. {materials: [MAT-0042], volume: 950uL, keys: ["heat_shock.2[T1]", "heat_shock.2[T2]"]}
10. Incubate T1, T2 at 37 C, shaking at 200 rpm, for 1 h in shaking incubator [[EQP-0002]]. {duration: 1h, wait: true, equipment: [EQP-0002], temp: 37C, checkpoint: "can extend to 90 min", key: heat_shock.3}

### Plate
11. Measure OD600 of T1 and record it. {measure: od600, record: true, key: "plate.od[T1]"}
12. Decision: if OD600 of T1 is below 0.5, use 100 uL; otherwise 20 uL. {key: "plate.volume[T1]"}
13. Plate 100 uL or 20 uL (step 12) of T1 onto kan agar plates, spread. {volume: "100uL or 20uL", key: "plate.spread[T1]"}
14. Measure OD600 of T2 and record it. {measure: od600, record: true, key: "plate.od[T2]"}
15. Decision: if OD600 of T2 is below 0.5, use 100 uL; otherwise 20 uL. {key: "plate.volume[T2]"}
16. Plate 100 uL or 20 uL (step 15) of T2 onto kan agar plates, spread. {volume: "100uL or 20uL", key: "plate.spread[T2]"}
17. Incubate kan agar plates at 37 C overnight in shaking incubator [[EQP-0002]]. {duration: 16h, wait: true, equipment: [EQP-0002], temp: 37C, checkpoint: "read next morning", key: plate.1}
