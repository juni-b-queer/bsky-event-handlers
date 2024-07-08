import {
    CreateFollowAction,
    CreateLikeAction,
    CreateReskeetAction,
    CreateSkeetAction,
    DeleteFollowAction,
    DeleteLikeAction,
    DeleteReskeetAction,
    DeleteSkeetAction,
} from '../../../src';
import {
    runTestSuiteDualParam,
    runTestSuiteSingleParam,
    TestCaseDualParam,
    TestCaseSingleParam,
} from './StandardTestSuite';

const testCasesSingleParam: TestCaseSingleParam[] = [
    {
        description: 'Delete Reskeet Action',
        mockHandler: 'unreskeetSkeet',
        actionFactory: DeleteReskeetAction.make,
        staticValue: 'uri://static',
        staticExpectation: 'uri://static',
        dynamicGenerator: jest.fn().mockReturnValue('uri://dynamic'),
        dynamicExpectation: 'uri://dynamic',
    },
];

const testCasesDualParam: TestCaseDualParam[] = [
    {
        description: 'Create Reskeet Action',
        mockHandler: 'reskeetSkeet',
        actionFactory: CreateReskeetAction.make,
        staticValues: ['uri://static', 'cid:static'],
        staticExpectations: ['uri://static', 'cid:static'],
        dynamicGenerators: [
            jest.fn().mockReturnValue('uri://dynamic'),
            jest.fn().mockReturnValue('cid:dynamic'),
        ],
        dynamicExpectations: ['uri://dynamic', 'cid:dynamic'],
    },
];

runTestSuiteSingleParam(testCasesSingleParam);
runTestSuiteDualParam(testCasesDualParam);
