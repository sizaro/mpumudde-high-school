// @ts-expect-error Jest provides this ESM helper at test runtime.
import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';

Object.assign(globalThis, { jest });

const createTestingModule = Test.createTestingModule.bind(Test);

Test.createTestingModule = ((metadata) =>
  createTestingModule(metadata).useMocker(
    () => new Proxy({}, { get: (_target, property) => property === 'then' ? undefined : jest.fn() }),
  )) as typeof Test.createTestingModule;
