import { handler } from '../src'

test('outputs correctly', () => {
    const result = handler('June');
    expect(result).toBe('Hello, June!')
})