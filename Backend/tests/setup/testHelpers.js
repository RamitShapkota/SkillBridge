import { jest } from "@jest/globals";

export const createMockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);

  return res;
};

export const runController = async (controller, req = {}) => {
  const res = createMockResponse();
  const next = jest.fn();

  controller(req, res, next);
  await new Promise((resolve) => setImmediate(resolve));

  return { res, next };
};
