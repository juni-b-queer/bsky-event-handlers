import {
    CreateFollowAction,
    CreateLikeAction,
    DeleteFollowAction,
    DeleteLikeAction,
} from '../../../src';
import {
    runTestSuiteDualParam,
    runTestSuiteSingleParam,
    TestCaseDualParam,
    TestCaseSingleParam,
} from './StandardTestSuite';

const testCasesSingleParam: TestCaseSingleParam[] = [
    {
        description: 'Delete like Action',
        mockHandler: 'unlikeSkeet',
        actionFactory: DeleteLikeAction.make,
        staticValue: 'uri://static',
        staticExpectation: 'uri://static',
        dynamicGenerator: jest.fn().mockReturnValue('uri://dynamic'),
        dynamicExpectation: 'uri://dynamic',
    },
];

const testCasesDualParam: TestCaseDualParam[] = [
    {
        description: 'Create Like Action',
        mockHandler: 'likeSkeet',
        actionFactory: CreateLikeAction.make,
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
