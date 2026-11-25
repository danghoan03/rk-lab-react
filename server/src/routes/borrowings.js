import { Router } from 'express';
import {
  createBorrowing,
  getBorrowingById,
  listBorrowings,
  returnBorrowing,
} from '../services/borrowingService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { status = 'all' } = req.query;
    const items = await listBorrowings({ status });
    return sendSuccess(res, { data: items });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await getBorrowingById(req.params.id);
    return sendSuccess(res, { data: item });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await createBorrowing(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: `Đã tạo phiếu mượn ${created.code_label}.`,
      data: created,
    });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id/return', async (req, res, next) => {
  try {
    const updated = await returnBorrowing(req.params.id, req.body);
    return sendSuccess(res, {
      message: `Đã ghi nhận trả thiết bị cho phiếu ${updated.code_label}.`,
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;

