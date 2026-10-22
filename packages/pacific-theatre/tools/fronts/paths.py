# Where the front tools read and write (research/content.md §3). Every other script here imports this
# first, so FRONTS_PYLIB is on the path before numpy, shapely or Pillow is imported.
#
#   FRONTS_DOWNLOADS  the downloads, outside the repository (needed by build.py, classify.py and
#                     atlas_register.py): atlas/jp2/*_NNNN.jp2, the leaves of the Atlas of the World
#                     Battle Fronts (archive.org's jp2 zip, unpacked), and ne/ne_50m_land.geojson and
#                     ne/ne_50m_countries.geojson (Natural Earth 1:50m, as GeoJSON)
#   FRONTS_OUT        where build.py and lines.py write and preview.py reads (default public/data/fronts)
#   FRONTS_VIEW       where the preview, check and registration images go (default the system's temp dir)
#   FRONTS_PYLIB      a directory holding numpy, shapely 2 and Pillow, put first on the path (optional;
#                     it works under python3 -I, which ignores PYTHONPATH)
import os, sys, tempfile

if os.environ.get('FRONTS_PYLIB'):
    sys.path.insert(0, os.environ['FRONTS_PYLIB'])

HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
FITS = HERE + 'fits/'  # the registration of each Atlas leaf (atlas_register.py writes them, classify.py reads them)
OUT = (os.environ.get('FRONTS_OUT') or os.path.normpath(HERE + '../../public/data/fronts')).rstrip('/') + '/'
VIEW = (os.environ.get('FRONTS_VIEW') or tempfile.gettempdir()).rstrip('/') + '/'


def downloads():
    d = os.environ.get('FRONTS_DOWNLOADS')
    if not d or not os.path.isdir(d):
        sys.exit('set FRONTS_DOWNLOADS to the directory holding atlas/jp2/ and ne/ (tools/fronts/paths.py)')
    return d.rstrip('/') + '/'
