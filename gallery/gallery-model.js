export const TAGS = ['game', 'simulation', 'tool', 'art', 'kids', 'tutorial']
export const STATUSES = ['done', 'wip']
export const THINKING = ['unknown', 'low', 'medium', 'high', 'extra', 'max', 'ultracode']

export function appProblems(app) {
  const problems = []
  const prefix = `"${app.slug}"`
  if (typeof app.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(app.slug)) problems.push(`${prefix} has an invalid slug`)
  for (const field of ['title', 'description']) if (typeof app[field] !== 'string') problems.push(`${prefix} has invalid ${field}`)
  if (!Array.isArray(app.tags) || !app.tags.length || app.tags.some(tag => !TAGS.includes(tag))) problems.push(`${prefix} has invalid or missing tags`)
  if (!STATUSES.includes(app.status)) problems.push(`${prefix} has unknown status "${app.status}"`)
  if (!THINKING.includes(app.thinking)) problems.push(`${prefix} has unknown thinking "${app.thinking}"`)
  if (!Array.isArray(app.models) || app.models.some(model => typeof model !== 'string')) problems.push(`${prefix} has invalid model credits`)
  return problems
}

export function validateManifest(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.apps)) throw new Error('Invalid gallery manifest')
  const slugs = new Set()
  for (const app of data.apps) {
    if (!app || appProblems(app).length || typeof app.hasThumbnail !== 'boolean' ||
        (app.updated !== null && (typeof app.updated !== 'string' || !Number.isFinite(Date.parse(app.updated)))) || slugs.has(app.slug)) {
      throw new Error('Invalid gallery app metadata')
    }
    slugs.add(app.slug)
  }
  return data.apps
}

export function parseFilters(hash = '') {
  let values
  try { values = decodeURIComponent(hash.replace(/^#/, '')).split(',') } catch { values = [] }
  return {
    tag: new Set(values.filter(value => TAGS.includes(value))),
    status: new Set(values.filter(value => STATUSES.includes(value))),
  }
}

export function matchesFilters(app, filters) {
  return (!filters.tag.size || app.tags.some(tag => filters.tag.has(tag))) &&
    (!filters.status.size || filters.status.has(app.status))
}

export function creditsText(app) {
  const parts = []
  if (app.models.length) parts.push(app.models.join(' + '))
  if (app.thinking !== 'unknown') parts.push(`${app.thinking} effort`)
  return parts.join(' · ')
}
