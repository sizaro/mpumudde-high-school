import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsController } from './subjects.controller.js';
import { SubjectsService } from './subjects.service.js';

describe('SubjectsController', () => {
  let controller: SubjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectsController],
      providers: [SubjectsService],
    }).compile();

    controller = module.get<SubjectsController>(SubjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
