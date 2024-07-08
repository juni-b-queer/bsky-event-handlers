import { CreateFollowAction, DeleteFollowAction } from '../../../src';
import {
    runTestSuiteSingleParam,
    TestCaseSingleParam,
} from './StandardTestSuite';

const testCases: TestCaseSingleParam[] = [
    {
        description: 'Create Follow Action',
        mockHandler: 'followUser',
        actionFactory: CreateFollowAction.make,
        staticValue: 'did:plc:static',
        staticExpectation: 'did:plc:static',
        dynamicGenerator: jest.fn().mockReturnValue('did:plc:dynamic'),
        dynamicExpectation: 'did:plc:dynamic',
    },
    {
        description: 'Delete Follow Action',
        mockHandler: 'unfollowUser',
        actionFactory: DeleteFollowAction.make,
        staticValue: 'did:plc:static',
        staticExpectation: 'did:plc:static',
        dynamicGenerator: jest.fn().mockReturnValue('did:plc:dynamic'),
        dynamicExpectation: 'did:plc:dynamic',
    },
];

runTestSuiteSingleParam(testCases);
