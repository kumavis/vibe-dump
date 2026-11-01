// tree: { nodes: [{ name?, shape?, p, r, s, color, roughness, metalness, anchor?, children }], animations?, controller? }
// The "sculpt it" path (design §8). Since design §17 it is an alias of the `rig`
// kind with inline nodes: same build, same patch-in-place, and adding
// `animations` (and a `controller`) to a tree component animates it without a
// kind swap. The node builder lives in nodes.js; the implementation in rig.js.
export { signature } from './nodes.js'
export { treeAlias as default } from './rig.js'
