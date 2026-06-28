import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import type { User } from './user.model';

export type ImportJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface ImportJobAttributes {
  id: string;
  jobId: string;
  fileName: string;
  filePath: string;
  status: ImportJobStatus;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  errorCsvPath: string | null;
  createdBy: string;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImportJobCreationAttributes
  extends Optional<
    ImportJobAttributes,
    | 'id'
    | 'totalRows'
    | 'processedRows'
    | 'successfulRows'
    | 'failedRows'
    | 'errorCsvPath'
    | 'startedAt'
    | 'completedAt'
    | 'createdAt'
    | 'updatedAt'
  > {}

class ImportJob
  extends Model<ImportJobAttributes, ImportJobCreationAttributes>
  implements ImportJobAttributes
{
  public id!: string;
  public jobId!: string;
  public fileName!: string;
  public filePath!: string;
  public status!: ImportJobStatus;
  public totalRows!: number;
  public processedRows!: number;
  public successfulRows!: number;
  public failedRows!: number;
  public errorCsvPath!: string | null;
  public createdBy!: string;
  public startedAt!: Date | null;
  public completedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly creator?: User;
}

ImportJob.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    totalRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    processedRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    successfulRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    failedRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    errorCsvPath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'import_jobs',
    timestamps: true,
  }
);

export { ImportJob };
export default ImportJob;
