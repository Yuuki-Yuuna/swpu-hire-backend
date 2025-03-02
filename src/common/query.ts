type QueryValue = string | number

export const createQuery = (query: Record<string, QueryValue | undefined>) => {
  const result = {
    query: {} as Record<string, QueryValue>,
    append: (key: string, value: QueryValue | undefined) => {
      if (value !== undefined) {
        result.query[key] = value
      }
    }
  }

  for (const key in query) {
    if (query[key] !== undefined) {
      result.query[key] = query[key]
    }
  }

  return result
}
