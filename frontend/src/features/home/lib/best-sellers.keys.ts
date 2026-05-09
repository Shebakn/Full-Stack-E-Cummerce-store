export const bestSellersKeys = {
  all: ["best-sellers"] as const,

  list: (
    categoryId?: string,
    includeChildren?: boolean,
    page?: number,
    limit?: number
  ) =>
    [
      "best-sellers",
      categoryId ?? "all",
      includeChildren ?? true,
      page ?? 1,
      limit ?? 10,
    ] as const,
};