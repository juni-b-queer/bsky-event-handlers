import { CreateSkeetAction, DeleteSkeetAction } from '../../../src';
import {
    runTestSuiteSingleParam,
    TestCaseSingleParam,
} from './StandardTestSuite';

const testCases: TestCaseSingleParam[] = [
    {
        description: 'Create Skeet Action',
        mockHandler: 'createSkeet',
        actionFactory: CreateSkeetAction.make,
        staticValue: 'Test Text',
        staticExpectation: 'Test Text',
        dynamicGenerator: jest.fn().mockReturnValue('Generated Text'),
        dynamicExpectation: 'Generated Text',
    },
    {
        description: 'Delete Skeet Action',
        mockHandler: 'deleteSkeet',
        actionFactory: DeleteSkeetAction.make,
        staticValue: 'uri://string',
        staticExpectation: 'uri://string',
        dynamicGenerator: jest.fn().mockReturnValue('uri://generated'),
        dynamicExpectation: 'uri://generated',
    },
];

runTestSuiteSingleParam(testCases);
