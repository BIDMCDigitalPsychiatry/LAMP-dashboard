export function extractIdsWithHierarchy(data) {
  return data.map((item) => {
    const result = {
      id: item.id,
      spec: item.spec,
      level: item.level,
      startTime: item.startTime,
      parentModule: item.parentModule,
      parentString: item.parentString,
    }
    if (item.subActivities && item.subActivities.length > 0) {
      result.subActivities = extractIdsWithHierarchy(item.subActivities)
    }
    return result
  })
}
