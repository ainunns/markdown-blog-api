import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/application/app.module';

interface AuthResponse {
  data?: {
    accessToken?: string;
    [key: string]: unknown;
  };
  accessToken?: string;
  [key: string]: unknown;
}

describe('Token API E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  function uniqueEmail(prefix = 'e2e'): string {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
  }

  const validPassword = 'Passw0rd!';

  it('register returns user data without token', async () => {
    const email = uniqueEmail('register');

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: validPassword })
      .expect(201);

    const body = registerRes.body as {
      data?: {
        id?: number;
        email?: string;
        role?: string;
        createdAt?: string;
        updatedAt?: string;
        deletedAt?: string | null;
      };
      [key: string]: unknown;
    };

    expect(body?.data).toBeDefined();
    expect(body?.data?.email).toBe(email);
    expect(body?.data?.id).toBeDefined();
    expect(body?.data?.role).toBe('user');
    expect(body?.data?.createdAt).toBeDefined();
    expect(body?.data?.updatedAt).toBeDefined();
    // Register should NOT return accessToken
    expect(body?.data).not.toHaveProperty('accessToken');
  });

  it('login returns accessToken and token can access /auth/me', async () => {
    const email = uniqueEmail('login');

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: validPassword })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: validPassword })
      .expect(200);

    const body = loginRes.body as AuthResponse;
    const token: string | undefined =
      body?.data?.accessToken ?? body?.accessToken;
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const meRes = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(meRes.body).toEqual(expect.objectContaining({ email }));
  });

  it('rejects access to /auth/me without token (401)', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('rejects access to /auth/me with invalid token (401)', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid.token.value')
      .expect(401);
  });
});
