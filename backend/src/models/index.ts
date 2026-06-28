import { sequelize } from '../config/database';
import { User } from './user.model';
import { Category } from './category.model';
import { Product } from './product.model';
import { ImportJob } from './import-job.model';

// Associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

ImportJob.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(ImportJob, { foreignKey: 'createdBy', as: 'importJobs' });

export { sequelize, User, Category, Product, ImportJob };
