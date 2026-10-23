# The die floorplan: how it was made and how sure we are

`floorplan.json` is the research floorplan of the Raptor Lake-S 8P+16E die
(Core i9-13900K, B0) that the app draws on. `fp2js.py` turns it into
`../src/floorplan.js`:

```bash
python3 research/fp2js.py research/floorplan.json src/floorplan.js   # from packages/cold-boot
```

Every block has normalized `x, y, w, h` in the photograph's frame (x across the
long edge from the PCIe/DMI end, y down from the DDR PHY edge), the same box in
pixels of a 3840-px-wide copy (`px3840`), a `confidence`, `notes` with the
evidence, and — for notched blocks — an `outline` and `outline_rects`.

## The photograph

Fritzchens Fritz's CC0 poly-layer shot of an i9-13900K engineering sample:
20330×9359 px, 23.413×10.791 mm (868 px/mm). It is a front-side view taken
after delayering: the transistor side, the way die shots are normally shown.

## How it was measured

1. **Two independent mappings, reconciled.** Two researchers mapped the die
   separately from the photo, Locuza's annotated Alder Lake-S die, and
   published Raptor Lake material. Their disagreements were settled by
   re-measuring the photo: gap profiles between blocks, mirror and rotation
   correlations, and counted PHY lanes.
2. **A second, adversarial audit.** Ten more investigators re-examined the die:
   - six took one region each;
   - one swept published annotations, including Nemez's annotation registered
     to this same photo;
   - one examined the ring bus;
   - one the mounting in the socket;
   - one the on-die interconnect.

   Each proposed correction went to one to three independent verifiers, each
   working through a different lens (re-crop the photo, check the sources,
   check consistency) and told to refute it. 64 corrections survived and were
   applied. Fresh-eyes critics then reviewed the result, and their fixes are
   in too. `changelog` lists every change with its evidence.

## How it sits in the socket (`mounting`)

The die is **flip-chip** (Intel: "Flip Chip Land Grid Array"): transistors face
down into the package. Seen from above it is therefore the **mirror image** of
the photograph. The app mirrors it. Intel's LGA1700 pin map (the ballout
spreadsheets attached to datasheets 655258 and 743844) fixes the rest:

- the DDR5 lands run along the package's east edge, toward the DIMMs;
- DMI and PCIe 5.0 x16 sit on the south edge, toward the x16 slot and the chipset;
- PCIe 4.0 x4 and the five display ports are on the west edge;
- the GPU's supply is on the north edge, toward the VRM.

Only the mirrored die puts each of its I/O blocks next to its own land group.
The die also sits about 1.8 mm toward its GPU end in the package (measured
from delidded photos; medium confidence).

## How packets travel (`wiring`)

The wires are in metal layers a poly-layer photo can't show. The graph
therefore models the logical paths through the physical channels you can
see:

- each core and each L3 slice drops straight to its ring stop;
- the System Agent reaches the two memory controllers through the memory
  fabric, and each controller reaches the DDR PHY;
- the I/O fabric runs down the PCIe/DMI controller column to the PHYs.

Interfaces that leave the chip are `exits` on the die edge. In the app they
continue across the package to their land group and onto the board trace
they feed.

## Confidence

| | |
|---|---|
| **High** | P-cores and their L2s; L3 slices; E-clusters; DDR, DMI, PCIe and display PHYs (lanes and ports counted); display engine; GPU execution units, L3 and samplers; the ring band; the mounting |
| **Medium** | Memory controllers; PCIe/DMI controller column; media engines; ring-stop positions; FIVR identities; most P-core internals (confirmed by Nemez's annotation of this die) |
| **Low** | The System Agent's identity (Locuza calls it the SA; Nemez and JmsDoug call it memory controller); the PCU, which is not located; `uncore_misc`; misc I/O; the GPU unslice's lower edge; E-core internals; the small unidentified macros, kept as `other` |

## Open questions

- Which half of the DDR PHY carries which DDR5 sub-channels. The ballout's land
  order suggests each half carries one sub-channel of *each* controller. The
  app's controller-0-to-half-A route is a convention, and its labels don't
  name channels.
- Which `pcie_ctrl` cluster is the DMI controller and which the PCIe one.
- Which rails the FIVRs feed.
- Several small areas are still unassigned (listed in `notes`).

## Sources

Listed in `floorplan.json` → `sources`. The main ones:

- Fritzchens Fritz's photo (CC0).
- Locuza's Alder Lake-S annotations and Raptor Lake-S mockup.
- Nemez's Raptor Lake-S annotation.
- TechPowerUp's ring-stop reading.
- Intel's datasheets 655258 / 743844 and their ballouts.
- Intel's Hot Chips 32/33 talks.
- Linux i915 and Mesa, for the display ports, PLLs and GPU L3.
