const {
    validateEnvironment,
    sanitizeInput,
    validationRules,
} = require('../utils/validation');

describe('Validation Utils', () => {
    describe('validateEnvironment', () => {
        const originalEnv = process.env;

        beforeEach(() => {
            jest.resetModules();
            process.env = { ...originalEnv };
        });

        afterAll(() => {
            process.env = originalEnv;
        });

        it('should not throw error when all required env vars are present', () => {
            process.env.MONGODB_URI = 'mongodb://localhost/test';
            process.env.EXPRESS_SESSION_SECRET = 'test-secret';

            expect(() => validateEnvironment()).not.toThrow();
        });

        it('should throw error when required env vars are missing', () => {
            delete process.env.MONGODB_URI;
            delete process.env.EXPRESS_SESSION_SECRET;

            expect(() => validateEnvironment()).toThrow(
                'Missing required environment variables'
            );
        });
    });

    describe('sanitizeInput', () => {
        it('should remove HTML tags', () => {
            const input = '<script>alert("xss")</script>Hello';
            const result = sanitizeInput(input);
            expect(result).toBe('scriptalert("xss")/scriptHello');
        });

        it('should trim whitespace', () => {
            const input = '  hello world  ';
            const result = sanitizeInput(input);
            expect(result).toBe('hello world');
        });

        it('should handle non-string input', () => {
            expect(sanitizeInput(123)).toBe(123);
            expect(sanitizeInput(null)).toBe(null);
            expect(sanitizeInput(undefined)).toBe(undefined);
        });
    });

    describe('validationRules', () => {
        it('should have user registration rules', () => {
            expect(validationRules.userRegistration).toBeDefined();
            expect(Array.isArray(validationRules.userRegistration)).toBe(true);
        });

        it('should have user login rules', () => {
            expect(validationRules.userLogin).toBeDefined();
            expect(Array.isArray(validationRules.userLogin)).toBe(true);
        });

        it('should have product creation rules', () => {
            expect(validationRules.productCreation).toBeDefined();
            expect(Array.isArray(validationRules.productCreation)).toBe(true);
        });

        it('should have cart update rules', () => {
            expect(validationRules.cartUpdate).toBeDefined();
            expect(Array.isArray(validationRules.cartUpdate)).toBe(true);
        });
    });
});
