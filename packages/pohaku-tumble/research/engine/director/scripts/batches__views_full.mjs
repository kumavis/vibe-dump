// Rerun of the "full" rows of views.mjs after fixing viewAt() for view "full" (ppu was NaN, so only one note could open).
import views from './views.mjs'
export default views.filter((j) => j.cfg.view === 'full')
