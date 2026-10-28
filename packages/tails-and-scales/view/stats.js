// What the table's frame drew that renderer.info doesn't count (V2), and
// what the figures cost to make, for the perf overlay (ui/perf.js):
//
//   drawStats.splats   the splats the table's render drew this frame:
//                      view/stage.js zeroes it before each frame's render,
//                      and a splat mesh adds the splats it draws as it is
//                      drawn (its onBeforeRender, view/models/splat/
//                      splats.js: the main render's only, since the race
//                      picker's windows draw after the overlay has read it).
//   drawStats.budget   the most splats a frame draws (splats.js's budget,
//                      the stage's quality's: past it the farthest figures
//                      step down a level of detail), 0 until a fur is made
//                      (a classic page draws none, and the overlay says
//                      nothing of splats)
//   drawStats.built    the milliseconds spent building figures since the
//                      page loaded, and how many builds (`builds`): each
//                      fresh build, a template's or a figure that draws
//                      (view/models/cache.js), its bake included; a clone
//                      is cheap and not counted. What the figure style
//                      costs a page's load: the title's armies are built
//                      before its first frame.
export const drawStats = { splats: 0, budget: 0, built: 0, builds: 0 }
