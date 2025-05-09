import {
    CreateSkeetAction,
    DeleteSkeetAction,
    JetstreamSubjectFactory,
    ReplyFactory,
    SendDMAction,
    SendDMToMultipleUsersAction,
} from '../../../src';
import {
    runTestSuiteDualParam,
    runTestSuiteSingleParam,
    runTestSuiteTripleParam,
    TestCaseDualParam,
    TestCaseSingleParam,
} from './StandardTestSuite';

// @ts-ignore
const testCasesTripleParam: TestCaseTripleParam[] = [
    {
        description: 'Send DM Action',
        mockHandler: 'sendMessageToUser',
        actionFactory: SendDMAction.make,
        staticValues: ['did:plc:example', 'Hello World', undefined],
        staticExpectations: ['did:plc:example', 'Hello World', undefined],
        dynamicGenerators: [
            jest.fn().mockReturnValue('did:plc:dynamic'),
            jest.fn().mockReturnValue('Hello Dynamic!'),
            undefined,
        ],
        dynamicExpectations: ['did:plc:dynamic', 'Hello Dynamic!', undefined],
    },
    {
        description: 'Send DM Action',
        mockHandler: 'sendMessageToUser',
        actionFactory: SendDMAction.make,
        staticValues: [
            'did:plc:example',
            'Hello World',
            JetstreamSubjectFactory.factory().create(),
        ],
        staticExpectations: [
            'did:plc:example',
            'Hello World',
            JetstreamSubjectFactory.factory().create(),
        ],
        dynamicGenerators: [
            jest.fn().mockReturnValue('did:plc:dynamic'),
            jest.fn().mockReturnValue('Hello Dynamic!'),
            jest
                .fn()
                .mockReturnValue(JetstreamSubjectFactory.factory().create()),
        ],
        dynamicExpectations: [
            'did:plc:dynamic',
            'Hello Dynamic!',
            JetstreamSubjectFactory.factory().create(),
        ],
    },
    {
        description: 'Send DM To Multiple Users Action',
        mockHandler: 'sendMessageToMultipleUsers',
        actionFactory: SendDMToMultipleUsersAction.make,
        staticValues: [
            ['did:plc:example', 'did:plc:example2'],
            'Hello World',
            JetstreamSubjectFactory.factory().create(),
        ],
        staticExpectations: [
            ['did:plc:example', 'did:plc:example2'],
            'Hello World',
            JetstreamSubjectFactory.factory().create(),
        ],
        dynamicGenerators: [
            jest.fn().mockReturnValue(['did:plc:other', 'did:plc:other2']),
            jest.fn().mockReturnValue('Hello Dynamic!'),
            jest
                .fn()
                .mockReturnValue(JetstreamSubjectFactory.factory().create()),
        ],
        dynamicExpectations: [
            ['did:plc:other', 'did:plc:other2'],
            'Hello Dynamic!',
            JetstreamSubjectFactory.factory().create(),
        ],
    },
    {
        description: 'Send DM To Multiple Users Action',
        mockHandler: 'sendMessageToMultipleUsers',
        actionFactory: SendDMToMultipleUsersAction.make,
        staticValues: [
            ['did:plc:example', 'did:plc:example2'],
            'Hello World',
            undefined,
        ],
        staticExpectations: [
            ['did:plc:example', 'did:plc:example2'],
            'Hello World',
            undefined,
        ],
        dynamicGenerators: [
            jest.fn().mockReturnValue(['did:plc:other', 'did:plc:other2']),
            jest.fn().mockReturnValue('Hello Dynamic!'),
            undefined,
        ],
        dynamicExpectations: [
            ['did:plc:other', 'did:plc:other2'],
            'Hello Dynamic!',
            undefined,
        ],
    },
];

runTestSuiteTripleParam(testCasesTripleParam);
