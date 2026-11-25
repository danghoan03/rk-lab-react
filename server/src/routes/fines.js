import { Router } from 'express';
import { getFineSummary, updateFineRate } from '../services/fineService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.get('/summary', async (_req, res, next) => {
  try {
    const summary = await getFineSummary();
    return sendSuccess(res, { data: summary });
  } catch (err) {
    return next(err);
  }
});

router.put('/rate', async (req, res, next) => {
  try {
    const updated = await updateFineRate(req.body?.fine_rate);
    return sendSuccess(res, {
      message: 'Đã lưu mức phạt mới vào cơ sở dữ liệu.',
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;

