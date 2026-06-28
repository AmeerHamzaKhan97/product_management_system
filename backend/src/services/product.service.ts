import { Product } from '../models/product.model';
import { productRepository, ProductFilters } from '../repositories/product.repository';
import { categoryRepository } from '../repositories/category.repository';
import { NotFoundError, BadRequestError } from '../types';
import { buildPaginationMeta } from '../utils/pagination.util';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants';

export interface ProductQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  items: Product[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const productService = {
  async getAll(query: ProductQuery): Promise<PaginatedProducts> {
    const page = Math.max(1, query.page ?? DEFAULT_PAGE);
    const pageSize = Math.min(Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

    const filters: ProductFilters = {
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page,
      pageSize,
    };

    const [items, total] = await Promise.all([
      productRepository.findAll(filters),
      productRepository.count({ search: query.search }),
    ]);

    return { items, pagination: buildPaginationMeta(total, page, pageSize) };
  },

  async getById(id: string): Promise<Product> {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found.');
    return product;
  },

  async create(data: {
    name: string;
    imageUrl: string;
    price: number;
    categoryId: string;
  }): Promise<Product> {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) throw new BadRequestError('Category not found.');
    return productRepository.create(data);
  },

  async update(
    id: string,
    data: { name: string; imageUrl: string; price: number; categoryId: string },
  ): Promise<Product> {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found.');

    const category = await categoryRepository.findById(data.categoryId);
    if (!category) throw new BadRequestError('Category not found.');

    return productRepository.update(id, data);
  },

  async delete(id: string): Promise<void> {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found.');
    await productRepository.delete(id);
  },
};
