"""Plasmid miniprep on a spin column: alkaline lysis, neutralisation, bind, wash, elute.

The example of a codified protocol in a notebook (docs/guide, "Protocols as code"): the
page next to this directory, PRO-0001, has its `## Steps` generated from this file by
`yajna-protocol page`, and the materials and equipment it names are pages in this lab.
"""

from yajna_protocol import Protocol, minutes, ml, seconds, ul, xg

requirements = {"yajna_protocol": "1"}
metadata = {"id": "PRO-0001", "name": "Plasmid miniprep on a spin column", "version": 1}


def add_parameters(p):
    p.add_material("culture", "Overnight culture", kind="strain", default="MAT-0001")
    p.add_int("n", "Number of cultures", default=4, minimum=1, maximum=24)
    p.add_float("elute_ul", "Elution volume", default=50.0, minimum=30.0, maximum=100.0, unit="uL")


def run(ctx: Protocol):
    culture = ctx.material(ctx.params.culture, name="overnight culture")
    resuspension = ctx.material("MAT-0002")
    lysis = ctx.material("MAT-0003")
    neutralisation = ctx.material("MAT-0004")
    wash = ctx.material("MAT-0005")
    elution = ctx.material("MAT-0006")
    spin = ctx.equipment("EQP-0001")
    spectro = ctx.equipment("EQP-0002")

    tubes = ctx.tubes(ctx.params.n, kind="tube_2ml")
    columns = ctx.tubes(ctx.params.n, kind="spin_column", prefix="C")
    eluates = ctx.tubes(ctx.params.n, prefix="E")

    with ctx.group("Harvest"):
        ctx.label(tubes)
        ctx.add(culture, 2 * ml, to=tubes, key="culture")
        ctx.centrifuge(tubes, force=6800 * xg, duration=3 * minutes, equipment=spin)
        ctx.discard_supernatant(tubes)

    with ctx.group("Lyse"):
        ctx.resuspend(tubes, volume=250 * ul, material=resuspension, key="resuspend",
                      check="no clumps left")
        ctx.add(lysis, 250 * ul, to=tubes, key="lysis")
        ctx.invert(tubes, times=6, hazard="lysis buffer is caustic",
                   check="lysate clear and viscous; no more than 5 min in lysis buffer")
        ctx.add(neutralisation, 350 * ul, to=tubes, key="neutralise")
        ctx.invert(tubes, times=6)
        ctx.centrifuge(tubes, force=17900 * xg, duration=10 * minutes, equipment=spin, key="clear")
        flakes = ctx.check("white flakes in the supernatant", default=False, key="flakes")
        ctx.when(flakes, lambda: ctx.centrifuge(tubes, force=17900 * xg, duration=5 * minutes, equipment=spin))

    with ctx.group("Bind and wash"):
        ctx.label(columns)
        for tube, column in zip(tubes, columns):
            ctx.transfer(800 * ul, source=tube, to=column, key="load")
        ctx.centrifuge(columns, force=17900 * xg, duration=60 * seconds, equipment=spin)
        ctx.step("Discard the flow-through and put each column back in its collection tube.")
        ctx.add(wash, 750 * ul, to=columns, key="wash")
        ctx.centrifuge(columns, force=17900 * xg, duration=60 * seconds, equipment=spin)
        ctx.step("Discard the flow-through and put each column back in its collection tube.")
        ctx.centrifuge(columns, force=17900 * xg, duration=60 * seconds, equipment=spin,
                       check="column dry; no ethanol left on the rim", key="dry")

    with ctx.group("Elute"):
        ctx.label(eluates)
        ctx.step("Seat each column in its eluate tube, C1 in E1 and so on.")
        ctx.add(elution, ctx.params.elute_ul * ul, to=columns, key="elute",
                check="buffer on the centre of the membrane")
        ctx.wait(1 * minutes, reason="let the buffer soak the membrane")
        ctx.centrifuge(columns, force=17900 * xg, duration=60 * seconds, equipment=spin)
        for e in eluates:
            ctx.measure("concentration", of=e, unit="ng/uL", default=150, equipment=spectro, key="yield")
        ctx.safe_stop("store the eluates at -20 C")
