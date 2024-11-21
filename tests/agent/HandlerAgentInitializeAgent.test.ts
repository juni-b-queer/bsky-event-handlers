import { HandlerAgent } from '../../src';
import { BskyAgent } from '@atproto/api';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
process.env.SESSION_DATA_PATH = './tests/temp';

describe('HandlerAgent', () => {
    it('should initialize BskyAgent if agent is not provided', () => {
        // Create spy on initializeBskyAgent method
        const initializeBskyAgentSpy = jest.spyOn(
            HandlerAgent.prototype,
            'initializeBskyAgent'
        );

        // Create a new instance of HandlerAgent without providing `agent`
        const handlerAgent = new HandlerAgent(
            'Test Agent',
            'Test Handle',
            'Test Password'
        );

        // Check if initializeBskyAgent method is called
        expect(initializeBskyAgentSpy).toHaveBeenCalled();

        // Check if `agent` is an instance of BskyAgent
        expect(handlerAgent.getAgent).toBeInstanceOf(BskyAgent);

        // Clean up by removing the spy
        initializeBskyAgentSpy.mockRestore();

        if (fs.existsSync(handlerAgent.getSessionLocation())) {
            fs.unlinkSync(handlerAgent.getSessionLocation());
        }
    });

    it('should initialize BskyAgent object if agent is null', async () => {
        // Create an instance of HandlerAgent
        const handlerAgent = new HandlerAgent(
            'Test Agent',
            'Test Handle',
            'Test Password'
        );

        // Set agent to null
        handlerAgent.setAgent = undefined;

        // Create spy on initializeBskyAgent method
        const initializeBskyAgentSpy = jest.spyOn(
            handlerAgent,
            'initializeBskyAgent'
        );

        // Mock agent.login method
        BskyAgent.prototype.login = jest.fn().mockImplementation(() => {
            handlerAgent.setSession = { did: 'plc:did:bot' } as any;
            handlerAgent.setDid = 'plc:did:bot';
        });

        BskyAgent.prototype.resumeSession = jest.fn().mockImplementation(() => {
            handlerAgent.setSession = { did: 'plc:did:bot' } as any;
            handlerAgent.setDid = 'plc:did:bot';
        });

        // Call authenticate method
        await handlerAgent.authenticate();

        // Check if initializeBskyAgent method is called
        expect(initializeBskyAgentSpy).toHaveBeenCalled();

        // Check if agent is an instance of BskyAgent after authenticate
        expect(handlerAgent.getAgent).toBeInstanceOf(BskyAgent);

        // Clean up by removing the spy
        initializeBskyAgentSpy.mockRestore();

        if (fs.existsSync(handlerAgent.getSessionLocation())) {
            fs.unlinkSync(handlerAgent.getSessionLocation());
        }
    });

    it('should throw error when session is undefined', async () => {
        // Create an instance of HandlerAgent
        const handlerAgent = new HandlerAgent(
            'Test Agent',
            'Test Handle',
            'Test Password'
        );

        if (fs.existsSync(handlerAgent.getSessionLocation())) {
            fs.unlinkSync(handlerAgent.getSessionLocation());
        }

        // Set session to null
        handlerAgent.setSession = undefined;

        // Mock agent.login method
        BskyAgent.prototype.login = jest.fn();

        // Expect authenticate method to throw an error
        await expect(handlerAgent.authenticate()).rejects.toThrow(
            'Could not retrieve bluesky session data for reply bot'
        );

        if (fs.existsSync(handlerAgent.getSessionLocation())) {
            fs.unlinkSync(handlerAgent.getSessionLocation());
        }
    });

    it('should throw error when agent is undefined after resumeSession', async () => {
        // Create an instance of HandlerAgent
        const handlerAgent = new HandlerAgent(
            'Test Agent',
            'Test Handle',
            'Test Password'
        );

        // Mock agent.login method
        BskyAgent.prototype.login = jest.fn().mockImplementation(() => {
            handlerAgent.setSession = { did: 'plc:did:bot' } as any;
            handlerAgent.setDid = 'plc:did:bot';
        });

        BskyAgent.prototype.resumeSession = jest.fn().mockImplementation(() => {
            handlerAgent.setSession = { did: 'plc:did:bot' } as any;
            handlerAgent.setDid = 'plc:did:bot';
        });

        // Mock agent.resumeSession method to nullify agent
        BskyAgent.prototype.resumeSession = jest.fn().mockImplementation(() => {
            handlerAgent.setAgent = undefined;
        });

        // Expect authenticate method to throw an error
        await expect(handlerAgent.authenticate()).rejects.toThrow(
            `Could not get agent from ${handlerAgent.getAgentName}`
        );

        if (fs.existsSync(handlerAgent.getSessionLocation())) {
            fs.unlinkSync(handlerAgent.getSessionLocation());
        }
    });
});
