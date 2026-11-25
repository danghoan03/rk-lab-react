import { Router } from 'express';
import {
  getPenaltyOverview,
  listPenaltyPayments,
  listPenaltyTickets,
  listStaffs,
  recordPenaltyPayment,
} from '../services/penaltyService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.get('/tickets', async (req, res, next) => {
  try {
    const status = req.query.penalty_status ?? req.query.status ?? 'ALL';
    const items = await listPenaltyTickets({ penaltyStatus: status });
    return sendSuccess(res, { data: items });
  } catch (err) {
    return next(err);
  }
});

router.get('/summary', async (_req, res, next) => {
  try {
    const overview = await getPenaltyOverview();
    return sendSuccess(res, { data: overview });
  } catch (err) {
    return next(err);
  }
});

router.get('/payments', async (req, res, next) => {
  try {
    const items = await listPenaltyPayments({ borrowId: req.query.borrow_id });
    return sendSuccess(res, { data: items });
  } catch (err) {
    return next(err);
  }
});

router.get('/tickets/:id/payments', async (req, res, next) => {
  try {
    const items = await listPenaltyPayments({ borrowId: req.params.id });
    return sendSuccess(res, { data: items });
  } catch (err) {
    return next(err);
  }
});

router.post('/tickets/:id/payments', async (req, res, next) => {
  try {
    const result = await recordPenaltyPayment({
      ...req.body,
      borrow_id: req.params.id,
    });
    return sendSuccess(res, {
      statusCode: 201,
      message: `Đã ghi nhận thu ${Number(result.payment.amount_paid).toLocaleString('vi-VN')} đ cho phiếu ${result.ticket.ticket_code}.`,
      data: result,
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/payments', async (req, res, next) => {
  try {
    const result = await recordPenaltyPayment(req.body || {});
    return sendSuccess(res, {
      statusCode: 201,
      message: `Đã ghi nhận thu ${Number(result.payment.amount_paid).toLocaleString('vi-VN')} đ cho phiếu ${result.ticket.ticket_code}.`,
      data: result,
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/staffs', async (_req, res, next) => {
  try {
    const staffs = await listStaffs();
    return sendSuccess(res, { data: staffs });
  } catch (err) {
    return next(err);
  }
});

export default router;

