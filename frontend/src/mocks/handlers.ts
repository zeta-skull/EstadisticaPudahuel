import { rest } from 'msw';
import { faker } from '@faker-js/faker';

const API_URL = '/api/v1';

export const handlers = [
  // Auth
  rest.post(`${API_URL}/auth/login`, async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email === 'admin@example.com' && password === 'admin123') {
      return res(
        ctx.status(200),
        ctx.json({
          access_token: faker.string.uuid(),
          token_type: 'bearer',
          user: {
            id: 1,
            email: 'admin@example.com',
            full_name: 'Admin User',
            is_active: true,
            is_superuser: true,
            created_at: faker.date.past().toISOString(),
            updated_at: faker.date.recent().toISOString(),
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        detail: 'Invalid credentials',
      })
    );
  }),

  rest.post(`${API_URL}/auth/register`, async (req, res, ctx) => {
    const { email, password, full_name } = await req.json();

    return res(
      ctx.status(201),
      ctx.json({
        id: faker.number.int(),
        email,
        full_name,
        is_active: true,
        is_superuser: false,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      })
    );
  }),

  // Statistics
  rest.get(`${API_URL}/statistics`, async (req, res, ctx) => {
    const statistics = Array.from({ length: 5 }, () => ({
      id: faker.number.int(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      category: faker.lorem.word(),
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [
          {
            label: faker.lorem.word(),
            data: Array.from({ length: 5 }, () => faker.number.int({ min: 0, max: 100 })),
          },
        ],
      },
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    }));

    return res(ctx.status(200), ctx.json(statistics));
  }),

  rest.post(`${API_URL}/statistics`, async (req, res, ctx) => {
    const data = await req.json();

    return res(
      ctx.status(201),
      ctx.json({
        id: faker.number.int(),
        ...data,
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
          datasets: [
            {
              label: data.title,
              data: Array.from({ length: 5 }, () => faker.number.int({ min: 0, max: 100 })),
            },
          ],
        },
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      })
    );
  }),

  rest.put(`${API_URL}/statistics/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        ...data,
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
          datasets: [
            {
              label: data.title,
              data: Array.from({ length: 5 }, () => faker.number.int({ min: 0, max: 100 })),
            },
          ],
        },
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      })
    );
  }),

  rest.delete(`${API_URL}/statistics/:id`, async (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  // Reports
  rest.get(`${API_URL}/reports`, async (req, res, ctx) => {
    const reports = Array.from({ length: 3 }, () => ({
      id: faker.number.int(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      type: faker.helpers.arrayElement(['excel', 'pdf']),
      file_path: faker.helpers.maybe(() => faker.system.filePath(), { probability: 0.5 }),
      statistics: Array.from({ length: faker.number.int({ min: 1, max: 3) }, () => ({
        id: faker.number.int(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        category: faker.lorem.word(),
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
          datasets: [
            {
              label: faker.lorem.word(),
              data: Array.from({ length: 5 }, () => faker.number.int({ min: 0, max: 100 })),
            },
          ],
        },
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      })),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    }));

    return res(ctx.status(200), ctx.json(reports));
  }),

  rest.post(`${API_URL}/reports`, async (req, res, ctx) => {
    const data = await req.json();

    return res(
      ctx.status(201),
      ctx.json({
        id: faker.number.int(),
        ...data,
        file_path: null,
        statistics: data.statistics.map((id: number) => ({
          id,
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          category: faker.lorem.word(),
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [
              {
                label: faker.lorem.word(),
                data: Array.from({ length: 5 }, () => faker.number.int({ min: 0, max: 100 })),
              },
            ],
          },
          created_at: faker.date.past().toISOString(),
          updated_at: faker.date.recent().toISOString(),
        })),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      })
    );
  }),

  rest.put(`${API_URL}/reports/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        ...data,
        file_path: null,
        statistics: data.statistics.map((id: number) => ({
          id,
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          category: faker.lorem.word(),
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [
              {
                label: faker.lorem.word(),
                data: Array.from({ length: 5 }, () => faker.number.int({ min: 0, max: 100 })),
              },
            ],
          },
          created_at: faker.date.past().toISOString(),
          updated_at: faker.date.recent().toISOString(),
        })),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      })
    );
  }),

  rest.delete(`${API_URL}/reports/:id`, async (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  // Dashboard
  rest.get(`${API_URL}/dashboard/config`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        widgets: Array.from({ length: 3 }, () => ({
          id: faker.number.int(),
          type: faker.helpers.arrayElement(['line', 'bar']),
          title: faker.lorem.sentence(),
          statistic_id: faker.number.int(),
        })),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      })
    );
  }),

  rest.put(`${API_URL}/dashboard/config`, async (req, res, ctx) => {
    const data = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        ...data,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      })
    );
  }),
]; 