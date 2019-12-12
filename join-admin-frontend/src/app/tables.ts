export type SortingDir = 'asc' | 'desc'

export type Sorting = { prop: string, direction: SortingDir, display: string }

export function sortEntities<T>(entities: T[], sorting: Sorting): T[] {
  return entities.sort((a: T, b: T) => {
    if (!sorting)
      return 0;

    if (a[sorting.prop] === null || a[sorting.prop] === undefined)
      return sorting.direction === 'asc' ? 1 : -1;
    else if (b[sorting.prop] === null || b[sorting.prop] === undefined)
      return sorting.direction === 'asc' ? -1 : 1;
    else if (a[sorting.prop] > b[sorting.prop])
      return sorting.direction === 'asc' ? 1 : -1;
    else if (a[sorting.prop] < b[sorting.prop])
      return sorting.direction === 'asc' ? -1 : 1;
    else
      return 0;
  });
}

export function changeSorting(prop: string, display: string, sorting: Sorting): Sorting {
  if (!sorting || sorting.prop !== prop) {
    return { prop, display, direction: "asc" };
  } else {
    return { prop, display, direction: sorting.direction === 'asc' ? 'desc' : 'asc' };
  }
}
