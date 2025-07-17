const request = require('supertest');

// Mock mongoose connection for tests
jest.mock('../config/mongoose-connection', () => ({
    connection: { readyState: 1 },
}));

const app = require('../app');

describe('App Initialization', () => {
    describe('Health Check', () => {
        it('should return health status', async () => {
            const response = await request(app).get('/health').expect(200);

            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for non-existent routes', async () => {
            const response = await request(app)
                .get('/non-existent-route')
                .expect(404);

            expect(response.text).toContain('Page Not Found');
        });
    });

    describe('Security Headers', () => {
        it('should include security headers', async () => {
            const response = await request(app).get('/health').expect(200);

            // Check for helmet security headers
            expect(response.headers).toHaveProperty('x-content-type-options');
            expect(response.headers).toHaveProperty('x-frame-options');
        });
    });

    describe('Rate Limiting', () => {
        it('should apply rate limiting', async () => {
            const response = await request(app).get('/health').expect(200);

            expect(response.headers).toHaveProperty('x-ratelimit-limit');
            expect(response.headers).toHaveProperty('x-ratelimit-remaining');
        });
    });
});
