import { SetupService } from './setup.service.js';

describe('SetupService', () => {
  it('creates an academic year', async () => {
    const prisma = {
      academicYear: {
        create: jest.fn().mockResolvedValue({ id: 'ay-1', name: '2026', isActive: true }),
      },
    };

    const service = new SetupService(prisma as any);
    const result = await service.createAcademicYear({ name: '2026', isActive: true });

    expect(result.name).toBe('2026');
    expect(prisma.academicYear.create).toHaveBeenCalledWith({
      data: { name: '2026', isActive: true },
    });
  });
});
