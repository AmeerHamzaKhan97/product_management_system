import { Op, WhereOptions } from 'sequelize';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { getPaginationOffset } from '../utils/pagination.util';

export interface ProductFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

const CATEGORY_INCLUDE = {
  model: Category,
  as: 'category',
  attributes: ['id', 'name', 'uniqueId'],
};

function buildWhereClause(search?: string): WhereOptions {
  if (!search) return {};
  return {
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { '$category.name$': { [Op.iLike]: `%${search}%` } },
    ],
  };
}

function resolveSortBy(sortBy?: string): string {
  const allowed = ['name', 'price', 'createdAt'];
  return allowed.includes(sortBy ?? '') ? (sortBy as string) : 'createdAt';
}

export const productRepository = {
  async findAll(filters: ProductFilters): Promise<Product[]> {
    const { search, sortBy, sortOrder, page = 1, pageSize = 10 } = filters;
    const order: [string, string] = [resolveSortBy(sortBy), sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC'];

    return Product.findAll({
      where: buildWhereClause(search),
      include: [CATEGORY_INCLUDE],
      order: [order],
      limit: pageSize,
      offset: getPaginationOffset(page, pageSize),
      subQuery: false,
    });
  },

  async findById(id: string): Promise<Product | null> {
    return Product.findByPk(id, { include: [CATEGORY_INCLUDE] });
  },

  async create(data: {
    name: string;
    imageUrl: string;
    price: number;
    categoryId: string;
  }): Promise<Product> {
    const product = await Product.create(data);
    return product.reload({ include: [CATEGORY_INCLUDE] });
  },

  async update(
    id: string,
    data: { name?: string; imageUrl?: string; price?: number; categoryId?: string },
  ): Promise<Product> {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found.');
    await product.update(data);
    return product.reload({ include: [CATEGORY_INCLUDE] });
  },

  async delete(id: string): Promise<void> {
    await Product.destroy({ where: { id } });
  },

  async findAllForReport(filters: {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<Product[]> {
    const { search, sortBy, sortOrder } = filters;
    const order: [string, string] = [
      resolveSortBy(sortBy),
      sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC',
    ];

    return Product.findAll({
      where: buildWhereClause(search),
      include: [CATEGORY_INCLUDE],
      order: [order],
      subQuery: false,
    });
  },

  async count(filters: { search?: string }): Promise<number> {
    const { search } = filters;
    if (!search) return Product.count();

    return Product.count({
      where: buildWhereClause(search),
      include: [{ model: Category, as: 'category', attributes: [] }],
      distinct: true,
    });
  },
};
