"""The worked example of `docs/protocol-framework.md`, section 4: heat-shock transformation
of chemically competent E. coli, with a parameter set, loops, equipment and a decision."""

from yajna_protocol import C, Protocol, minutes, overnight, rpm, seconds, ul

requirements = {"yajna_protocol": "1"}
metadata = {
    "id": "PRO-0012",
    "name": "Heat-shock transformation of chemically competent E. coli",
    "version": 4,
    "author": "ank",
}


def add_parameters(p):
    p.add_material("cells", "Competent cells", kind="strain", default="MAT-0210")
    p.add_material("plasmid", "Plasmid", kind="plasmid")
    p.add_int("n", "Number of transformations", default=2, minimum=1, maximum=12)
    p.add_float("dna_ul", "DNA per transformation", default=1.0, minimum=0.5, maximum=5.0, unit="uL")
    p.add_choice("antibiotic", "Selection", choices=["kan", "amp", "cm"], default="kan")


def run(ctx: Protocol):
    cells = ctx.material(ctx.params.cells, name="competent cells", liquid_class="cells")
    plasmid = ctx.material(ctx.params.plasmid)
    soc = ctx.material("MAT-0042", name="SOC")
    plates = ctx.material(name=f"{ctx.params.antibiotic} agar plates")
    bath = ctx.equipment(kind="water_bath")
    incubator = ctx.equipment(kind="shaking_incubator")
    tubes = ctx.tubes(ctx.params.n)

    with ctx.group("Prepare"):
        ctx.set(bath, temperature=42 * C, duration=15 * minutes)
        ctx.thaw(cells, on="ice", duration=10 * minutes, check="cells fully thawed, no clumps")
        ctx.label(tubes)
        ctx.add(cells, 50 * ul, to=tubes, on="ice", key="add_cells")
        ctx.add(plasmid, ctx.params.dna_ul * ul, to=tubes, mix="flick", key="add_dna")
        ctx.incubate(tubes, on="ice", duration=30 * minutes)

    with ctx.group("Heat shock"):
        ctx.heat_shock(tubes, equipment=bath, temperature=42 * C, duration=45 * seconds,
                       check="all tubes fully submerged", key="heat_shock")
        ctx.incubate(tubes, on="ice", duration=2 * minutes)
        ctx.add(soc, 950 * ul, to=tubes)
        ctx.incubate(tubes, equipment=incubator, temperature=37 * C, shaking=200 * rpm,
                     duration=60 * minutes, checkpoint="can extend to 90 min")

    with ctx.group("Plate"):
        for t in tubes:
            od = ctx.measure("od600", of=t, default=0.3, key="od")
            volume = ctx.decide(od < 0.5, 100 * ul, 20 * ul, key="volume")
            ctx.plate_cells(t, volume=volume, onto=plates, spread=True, key="spread")
        ctx.incubate(plates, equipment=incubator, temperature=37 * C, duration=overnight,
                     checkpoint="read next morning")
