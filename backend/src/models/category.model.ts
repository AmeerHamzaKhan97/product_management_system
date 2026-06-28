import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { generateCategoryId } from '../utils/unique-id.util';

interface CategoryAttributes {
  id: string;
  uniqueId: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id' | 'uniqueId' | 'createdAt' | 'updatedAt'> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public uniqueId!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
    hooks: {
      beforeValidate: async (category: Category) => {
        if (!category.uniqueId) {
          category.uniqueId = await generateCategoryId();
        }
      },
    },
  }
);

export { Category };
export default Category;
