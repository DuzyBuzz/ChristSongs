export interface PaginatedResult<TItem> {
  readonly items: readonly TItem[];
  readonly hasMore: boolean;
}