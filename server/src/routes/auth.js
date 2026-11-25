import { Router } from 'express';
import {
  getDemoUserByRole,
  getUserById,
  loginUser,
  registerUser,
} from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const user = await loginUser(req.body || {});
    return sendSuccess(res, {
      message: 'Đăng nhập thành công.',
      data: user,
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const user = await registerUser(req.body || {});
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Tạo tài khoản thành công.',
      data: user,
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return sendSuccess(res, { data: user });
  } catch (err) {
    return next(err);
  }
});

router.get('/demo/:role', async (req, res, next) => {
  try {
    const user = await getDemoUserByRole(req.params.role);
    return sendSuccess(res, { data: user });
  } catch (err) {
    return next(err);
  }
});

export default router;

