async getByCategory(category: string) {
  return this.prisma.product.findMany({
    where: { category },
    include: { images: true }
  });
}