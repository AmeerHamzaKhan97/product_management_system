import { Op } from 'sequelize';
import { Category } from '../models/category.model';

export const categoryRepository = {
  async findAll(): Promise<Category[]> {
    return Category.findAll({ order: [['name', 'ASC']] });
  },

  async findById(id: string): Promise<Category | null> {
    return Category.findByPk(id);
  },

  async findByName(name: string): Promise<Category | null> {
    return Category.findOne({
      where: { name: { [Op.iLike]: name } },
    });
  },

  async create(data: { name: string }): Promise<Category> {
    return Category.create({ name: data.name });
  },

  async update(id: string, data: { name: string }): Promise<Category> {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found.');
    return category.update({ name: data.name });
  },

  async delete(id: string): Promise<void> {
    await Category.destroy({ where: { id } });
  },
};
