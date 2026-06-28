import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { generateProductId } from '../utils/unique-id.util';
import type { Category } from './category.model';

interface ProductAttributes {
  id: string;
  uniqueId: string;
  name: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, 'id' | 'uniqueId' | 'createdAt' | 'updatedAt'> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public uniqueId!: string;
  public name!: string;
  public imageUrl!: string;
  public price!: number;
  public categoryId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly category?: Category;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    uniqueId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    hooks: {
      beforeValidate: async (product: Product) => {
        if (!product.uniqueId) {
          product.uniqueId = await generateProductId();
        }
      },
    },
  }
);

export { Product };
export default Product;
