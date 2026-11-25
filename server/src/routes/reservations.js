import { Router } from 'express';
import {
  cancelReservation,
  createReservation,
  listReservations,
} from '../services/reservationService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await listReservations({ equipmentId: req.query.equipment_id });
    return sendSuccess(res, { data: items });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await createReservation(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: `Đã thêm yêu cầu đặt trước cho ${created.requester_name}.`,
      data: created,
    });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const updated = await cancelReservation(req.params.id);
    return sendSuccess(res, {
      message: 'Đã hủy yêu cầu đặt trước.',
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;

