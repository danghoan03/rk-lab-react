import { Router } from 'express';
import {
  createEquipment,
  deleteEquipment,
  getEquipmentDetail,
  listEquipments,
  updateEquipment,
} from '../services/equipmentService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', category = 'all', page = 1, limit = 6 } = req.query;
    const result = await listEquipments({ search, category, page, limit });
    return sendSuccess(res, {
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await getEquipmentDetail(req.params.id);
    return sendSuccess(res, { data: item });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await createEquipment(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Thêm thiết bị thành công.',
      data: created,
    });
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await updateEquipment(req.params.id, req.body);
    return sendSuccess(res, {
      message: 'Cập nhật thiết bị thành công.',
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deleteEquipment(req.params.id);
    return sendSuccess(res, {
      message: 'Xóa thiết bị thành công.',
      data: deleted,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;

