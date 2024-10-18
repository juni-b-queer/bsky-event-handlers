import {
    CreateLikeAction,
    CreateSkeetAction,
    DeleteSkeetAction,
    ReplyFactory,
} from '../../../src';
import {
    runTestSuiteDualParam,
    runTestSuiteSingleParam,
    TestCaseDualParam,
    TestCaseSingleParam,
} from './StandardTestSuite';

const testCases: TestCaseSingleParam[] = [
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

// @ts-ignore
const testCasesDualParam: TestCaseDualParam[] = [
    {
        description: 'Create Skeet Action',
        mockHandler: 'createSkeet',
        actionFactory: CreateSkeetAction.make,
        staticValues: ['Test Text', ReplyFactory.factory().create()],
        staticExpectations: ['Test Text', ReplyFactory.factory().create()],
        dynamicGenerators: [
            jest.fn().mockReturnValue('Generated Text'),
            jest.fn().mockReturnValue(ReplyFactory.factory().create()),
        ],
        dynamicExpectations: [
            'Generated Text',
            ReplyFactory.factory().create(),
        ],
    },
];

runTestSuiteSingleParam(testCases);
runTestSuiteDualParam(testCasesDualParam);
