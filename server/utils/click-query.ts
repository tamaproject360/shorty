import type { Query } from '@@/schemas/query'

const FILTER_COLUMNS: Partial<Record<keyof Query, string>> = {
  id: 'link_id',
  slug: 'slug',
  startAt: 'created_at >=',
  endAt: 'created_at <=',
  country: 'country',
  referer: 'referer',
  deviceType: 'device_type',
  device: 'device',
  os: 'os',
  browser: 'browser',
  browserType: 'browser_type',
  language: 'language',
  timezone: 'timezone',
  region: 'region',
  city: 'city',
}

export function buildClickWhere(query: Partial<Query>, extraConditions: string[] = []) {
  const conditions: string[] = []
  const params: (string | number)[] = []

  for (const [key, column] of Object.entries(FILTER_COLUMNS) as [keyof Query, string][]) {
    const value = query[key]
    if (value === undefined || value === '')
      continue

    if (column.endsWith('>=') || column.endsWith('<=')) {
      conditions.push(`${column} ?`)
    }
    else {
      conditions.push(`${column} = ?`)
    }
    params.push(value as string | number)
  }

  conditions.push('is_bot = 0', ...extraConditions)

  return {
    where: `WHERE ${conditions.join(' AND ')}`,
    params,
  }
}
