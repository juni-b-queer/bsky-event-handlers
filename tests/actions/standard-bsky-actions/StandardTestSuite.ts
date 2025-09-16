// testSuite.ts
import { HandlerAgent } from '../../../src';

export interface TestCaseSingleParam {
    description: string;
    mockHandler: string;
    actionFactory: any;
    staticValue: string;
    staticExpectation: string;
    dynamicGenerator: any;
    dynamicExpectation: string;
}

export const runTestSuiteSingleParam = (testCases: TestCaseSingleParam[]) => {
    describe.each(testCases)(
        '$description',
        (testCase: TestCaseSingleParam) => {
            let action;
            let handlerAgent: HandlerAgent;
            const mockHandler = jest.fn();

            beforeEach(() => {
                handlerAgent = {
                    [testCase.mockHandler]: mockHandler,
                } as unknown as HandlerAgent;
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            it('Should call with static value', async () => {
                action = testCase.actionFactory(testCase.staticValue);
                await action.handle(handlerAgent);
                expect(mockHandler).toHaveBeenCalledWith(
                    testCase.staticExpectation
                );
            });

            it('Should call with value from generator', async () => {
                action = testCase.actionFactory(testCase.dynamicGenerator);
                await action.handle(handlerAgent);
                expect(mockHandler).toHaveBeenCalledWith(
                    testCase.dynamicExpectation
                );
            });
        }
    );
};

export interface TestCaseDualParam {
    description: string;
    mockHandler: string;
    actionFactory: any;
    staticValues: [any, any];
    staticExpectations: [any, any];
    dynamicGenerators: [any, any];
    dynamicExpectations: [any, any];
}

export const runTestSuiteDualParam = (testCases: TestCaseDualParam[]) => {
    describe.each(testCases)('$description', (testCase: TestCaseDualParam) => {
        let action;
        let handlerAgent: HandlerAgent;
        const mockHandler = jest.fn();

        beforeEach(() => {
            handlerAgent = {
                [testCase.mockHandler]: mockHandler,
            } as unknown as HandlerAgent;
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('Should call with static values', async () => {
            action = testCase.actionFactory(...testCase.staticValues);
            await action.handle(handlerAgent);
            expect(mockHandler).toHaveBeenCalledWith(
                ...testCase.staticExpectations
            );
        });

        it('Should call with values from generators', async () => {
            action = testCase.actionFactory(...testCase.dynamicGenerators);
            await action.handle(handlerAgent);
            expect(mockHandler).toHaveBeenCalledWith(
                ...testCase.dynamicExpectations
            );
        });
    });
};

export interface TestCaseTripleParam {
    description: string;
    mockHandler: string;
    actionFactory: any;
    staticValues: [any, any, any];
    staticExpectations: [any, any, any];
    dynamicGenerators: [any, any, any];
    dynamicExpectations: [any, any, any];
}

export const runTestSuiteTripleParam = (testCases: TestCaseDualParam[]) => {
    describe.each(testCases)('$description', (testCase: TestCaseDualParam) => {
        let action;
        let handlerAgent: HandlerAgent;
        const mockHandler = jest.fn();

        beforeEach(() => {
            handlerAgent = {
                [testCase.mockHandler]: mockHandler,
            } as unknown as HandlerAgent;
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('Should call with static values', async () => {
            action = testCase.actionFactory(...testCase.staticValues);
            await action.handle(handlerAgent);
            expect(mockHandler).toHaveBeenCalledWith(
                ...testCase.staticExpectations
            );
        });

        it('Should call with values from generators', async () => {
            action = testCase.actionFactory(...testCase.dynamicGenerators);
            await action.handle(handlerAgent);
            expect(mockHandler).toHaveBeenCalledWith(
                ...testCase.dynamicExpectations
            );
        });
    });
};
