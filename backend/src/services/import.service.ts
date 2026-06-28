import { randomUUID } from 'crypto';
import { importJobRepository } from '../repositories/import-job.repository';
import { importQueue } from '../queues/import.queue';

export const importService = {
  async uploadCsv(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ jobId: string }> {
    const jobId = randomUUID();

    const importJob = await importJobRepository.create({
      jobId,
      fileName: file.originalname,
      filePath: file.path,
      createdBy: userId,
    });

    await importQueue.add(
      'process-import',
      { importJobId: importJob.id, filePath: file.path },
      { jobId },
    );

    return { jobId };
  },
};
