import { ImportJob, ImportJobStatus } from '../models/import-job.model';
import { User } from '../models/user.model';

const CREATOR_INCLUDE = {
  model: User,
  as: 'creator',
  attributes: ['id', 'email'],
};

export const importJobRepository = {
  async create(data: {
    jobId: string;
    fileName: string;
    filePath: string;
    createdBy: string;
  }): Promise<ImportJob> {
    return ImportJob.create({
      jobId: data.jobId,
      fileName: data.fileName,
      filePath: data.filePath,
      status: 'pending',
      createdBy: data.createdBy,
    });
  },

  async findById(id: string): Promise<ImportJob | null> {
    return ImportJob.findByPk(id, { include: [CREATOR_INCLUDE] });
  },

  async findByJobId(jobId: string): Promise<ImportJob | null> {
    return ImportJob.findOne({ where: { jobId } });
  },

  async findAll(): Promise<ImportJob[]> {
    return ImportJob.findAll({
      include: [CREATOR_INCLUDE],
      order: [['createdAt', 'DESC']],
    });
  },

  async updateStatus(
    id: string,
    status: ImportJobStatus,
    extra?: {
      jobId?: string;
      totalRows?: number;
      processedRows?: number;
      successfulRows?: number;
      failedRows?: number;
      errorCsvPath?: string | null;
      startedAt?: Date;
      completedAt?: Date;
    },
  ): Promise<void> {
    await ImportJob.update({ status, ...extra }, { where: { id } });
  },
};
