import { Category } from '../models/category.model';
import { categoryRepository } from '../repositories/category.repository';
import { ConflictError, NotFoundError } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return categoryRepository.findAll();
  },

  async getById(id: string): Promise<Category> {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found.');
    return category;
  },

  async create(name: string): Promise<Category> {
    const trimmed = name.trim();
    const existing = await categoryRepository.findByName(trimmed);
    if (existing) throw new ConflictError('A category with this name already exists.');
    return categoryRepository.create({ name: trimmed });
  },

  async update(id: string, name: string): Promise<Category> {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found.');

    const trimmed = name.trim();
    const existing = await categoryRepository.findByName(trimmed);
    if (existing && existing.id !== id) {
      throw new ConflictError('A category with this name already exists.');
    }

    return categoryRepository.update(id, { name: trimmed });
  },

  async delete(id: string): Promise<void> {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found.');
    await categoryRepository.delete(id);
  },
};
