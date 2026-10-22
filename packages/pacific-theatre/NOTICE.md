# Pacific Theatre: notices and credits

The data under `public/data/` was produced from the sources below, each used
under the terms stated. The same text is shown in the app's Sources and
credits panel and, for a battle box, in its briefing card's footer; every
box's `manifest.json` carries its own notice so that it travels with a fork
or a download of the data.

## Terrain in the battle boxes: Copernicus WorldDEM-30 (GLO-30)

Produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus
Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European
Union and ESA; all rights reserved.

The organisations in charge of the Copernicus programme by law or by
delegation do not incur any liability for any use of the Copernicus
WorldDEM-30.

The data was resampled to each box's grid, land was decided by a half-land
rule and sea texels were clamped; nothing here implies official endorsement
by the European Union, ESA, DLR or Airbus.

## Sea floor in the battle boxes: GMRT

Global Multi-Resolution Topography (GMRT) synthesis, Ryan, W. B. F., et al.
(2009), *Geochemistry, Geophysics, Geosystems* 10, Q03014,
doi:10.1029/2008GC002332. Licensed under CC BY 4.0
(<https://creativecommons.org/licenses/by/4.0/>). Resampled and clamped for
this app.

## The table's relief, and the boxes' sea floor where GMRT was not used: ETOPO 2022

NOAA National Centers for Environmental Information (2022), *ETOPO 2022
Global Relief Model* (the 60 arc-second grid for the table, the 15
arc-second tiles in the boxes), doi:10.25921/fd45-gt74. Public domain (US
government work).

## Pearl Harbor's harbour and south shore: NOAA CUDEM

NOAA National Centers for Environmental Information, *Continuously Updated
Digital Elevation Model (CUDEM), 1/9 arc-second resolution bathymetric-
topographic tiles* (Hawaiʻi), public domain (US government work); resampled
and set back to the shore of 1941 on the dated record of the harbour's
works. The rest of the Pearl Harbor box is Copernicus WorldDEM-30 as above.

The berths F-6 to F-8 and the wrecks of Arizona and Utah were positioned
from OpenStreetMap: © OpenStreetMap contributors, Open Database License
(ODbL).

The shore of 7 December 1941 was recovered by undoing the harbour's and the
airport's later works at the box's 50 m texel, on the dated record in
*Building the Navy's Bases in World War II*, vol. II, ch. XXII (Bureau of
Yards and Docks, 1947; public domain, HyperWar transcription); the Hawaiʻi
Department of Transportation's Honolulu International Airport histories
(State of Hawaiʻi publications, quoted for their dates); *Images of Old
Hawaiʻi*'s Ala Wai posts (quoted for their dates; text © its author); the
1881 Government Survey and the 1938 USGS sheets of Oʻahu as georeferenced
by the State of Hawaiʻi GIS Program (open data; the maps themselves are
public-domain surveys); and the Hawaiian diorama's own dated works list.
Each work, with its sources, is listed under `shore.works` in the box's
`manifest.json`.

## Coastlines and positions on the table: Natural Earth

Natural Earth, version 5 (10 m physical and cultural vectors),
<https://www.naturalearthdata.com/>. Public domain; credited as a courtesy.
No Natural Earth name string is shown in the app.

## Fonts

Fraunces and Inter, and the Noto Sans JP subset, under the SIL Open Font
License 1.1 (see `FONTS.md`).

## The record

The historical record on the cards is cited source by source in
`public/data/sources.json` and on each card. Public-domain US government
works (the official histories, action reports and recognition manuals on
HyperWar and the Internet Archive) are quoted where a quotation is marked;
works in copyright are cited and never reproduced; images held by the
Japanese National Institute for Defense Studies are cited by reference and
never shown.
