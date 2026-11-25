import assert from 'node:assert/strict';
import { getLocalTodayISO } from './src/db/connection.js';
import {
  getDemoUserByRole,
  getUserById,
  loginUser,
  registerUser,
} from './src/services/authService.js';
import {
  createBorrowing,
  listBorrowings,
  returnBorrowing,
} from './src/services/borrowingService.js';
import {
  createEquipment,
  deleteEquipment,
  getEquipmentDetail,
  listEquipments,
  updateEquipment,
} from './src/services/equipmentService.js';
import { getFineSummary, updateFineRate } from './src/services/fineService.js';
import {
  getPenaltyOverview,
  listPenaltyPayments,
  listPenaltyTickets,
  listStaffs,
  recordPenaltyPayment,
} from './src/services/penaltyService.js';
import {
  cancelReservation,
  createReservation,
  listReservations,
} from './src/services/reservationService.js';

function addDays(iso, days) {
  const dt = new Date(`${iso}T00:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

async function runTests() {
  // 1. Search, filter, pagination
  const page1 = await listEquipments({ search: 'LAB', category: 'Laptop', page: 1, limit: 2 });
  assert.equal(page1.items.length, 2);
  assert.ok(page1.meta.total >= 3);
  assert.ok('remaining_quantity' in page1.items[0]);

  // 2. Detail
  const detail = await getEquipmentDetail(1);
  assert.equal(detail.code, 'LAB-001');
  assert.ok(Array.isArray(detail.recent_borrowings));

  // 3. Create + duplicate code rejection + invalid total_quantity rejection
  const created = await createEquipment({
    code: 'LAB-TEST-99',
    name: 'Máy chiếu Sony Test',
    category: 'Phụ kiện',
    total_quantity: 5,
  });
  assert.equal(created.remaining_quantity, 5);

  await assert.rejects(
    () => createEquipment({ code: 'LAB-TEST-99', name: 'Dup', total_quantity: 1 }),
    (err) => err.statusCode === 409 && err.code === 'DUPLICATE_CODE'
  );
  await assert.rejects(
    () => createEquipment({ code: 'LAB-BAD', name: '', total_quantity: -2 }),
    (err) => err.statusCode === 400 && err.code === 'VALIDATION_ERROR'
  );

  // 4. Update equipment including total_quantity
  const updated = await updateEquipment(created.id, {
    code: 'LAB-TEST-99',
    name: 'Máy chiếu Sony Updated',
    category: 'Phụ kiện',
    total_quantity: 3,
  });
  assert.equal(updated.total_quantity, 3);

  // 5. Borrowing: max 14 days, quantity <= remaining, today borrowed_at, return + fine_paid
  const today = getLocalTodayISO();
  await assert.rejects(
    () =>
      createBorrowing({
        equipment_id: created.id,
        borrower_name: 'Người mượn Test',
        quantity: 1,
        due_date: addDays(today, 15),
      }),
    (err) => err.statusCode === 400 && Boolean(err.details?.due_date)
  );
  await assert.rejects(
    () =>
      createBorrowing({
        equipment_id: created.id,
        borrower_name: 'Người mượn Test',
        quantity: 4,
        due_date: addDays(today, 7),
      }),
    (err) => err.statusCode === 400 && err.code === 'INSUFFICIENT_QUANTITY'
  );

  const [ty, tm, td] = addDays(today, 14).split('-');
  const borrow = await createBorrowing({
    equipment_id: created.id,
    borrower_name: 'Nguyễn Văn Kiểm Thử',
    quantity: 2,
    due_date: `${td}/${tm}/${ty}`,
    note: 'Kiểm thử API',
  });
  assert.equal(borrow.status, 'borrowing');
  assert.equal(borrow.borrowed_at.slice(0, 10), today);

  const afterBorrowDetail = await getEquipmentDetail(created.id);
  assert.equal(afterBorrowDetail.remaining_quantity, 1);

  await assert.rejects(
    () => deleteEquipment(created.id),
    (err) => err.statusCode === 409 && err.code === 'EQUIPMENT_IN_USE'
  );

  const returned = await returnBorrowing(borrow.id, { fine_paid: 15000 });
  assert.equal(returned.status, 'returned');
  assert.equal(returned.fine_paid, 15000);
  assert.ok(returned.returned_at);

  const overdueList = await listBorrowings({ status: 'overdue' });
  assert.equal(overdueList.length, 5);
  const borrowingList = await listBorrowings({ status: 'borrowing' });
  assert.equal(borrowingList.length, 6);
  const returnedList = await listBorrowings({ status: 'returned' });
  assert.equal(returnedList.length, 8);

  // 6. Delete standalone equipment with no borrowings
  const standalone = await createEquipment({
    code: 'LAB-DEL-01',
    name: 'Thiết bị xóa thử',
    category: 'Phụ kiện',
    total_quantity: 2,
  });
  const deleted = await deleteEquipment(standalone.id);
  assert.equal(deleted.id, standalone.id);

  // 7. Fines settings persistence
  const fineUpdated = await updateFineRate(10000);
  assert.equal(fineUpdated.fine_rate, 10000);
  const fineFetched = await getFineSummary();
  assert.equal(fineFetched.fine_rate, 10000);

  // 8. Reservations persistence
  const reservation = await createReservation({
    equipment_id: 4,
    requester_name: 'Nguyễn Kiểm Thử Đặt Trước',
    quantity: 1,
  });
  assert.equal(reservation.status, 'waiting');
  const cancelled = await cancelReservation(reservation.id);
  assert.equal(cancelled.status, 'cancelled');
  const resList = await listReservations({ equipmentId: 4 });
  assert.ok(resList.some((r) => r.id === reservation.id && r.status === 'cancelled'));

  // 9. Auth persistence
  const regUser = await registerUser({
    full_name: 'Tài Khoản Mới',
    email: 'newuser@rikkei.edu',
    password: 'secret',
  });
  assert.equal(regUser.role, 'student');
  const loggedIn = await loginUser({ email: 'newuser@rikkei.edu', password: 'secret' });
  assert.equal(loggedIn.id, regUser.id);
  const fetchedUser = await getUserById(regUser.id);
  assert.equal(fetchedUser.email, 'newuser@rikkei.edu');
  const staffDemo = await getDemoUserByRole('staff');
  assert.equal(staffDemo.role, 'staff');

  // 10. Penalty tickets, staffs, overview, partial/full payment, and payment history
  const staffs = await listStaffs();
  assert.equal(staffs.length, 10);

  const allTickets = await listPenaltyTickets({ penaltyStatus: 'ALL' });
  assert.equal(allTickets.length, 12);
  const unpaidTickets = await listPenaltyTickets({ penaltyStatus: 'UNPAID' });
  assert.equal(unpaidTickets.length, 3);
  const partialTickets = await listPenaltyTickets({ penaltyStatus: 'PARTIAL' });
  assert.equal(partialTickets.length, 3);
  const paidTickets = await listPenaltyTickets({ penaltyStatus: 'PAID' });
  assert.equal(paidTickets.length, 3);

  const overviewBefore = await getPenaltyOverview();
  assert.equal(overviewBefore.payments_count, 10);

  const targetTicket = unpaidTickets[0];
  await assert.rejects(
    () =>
      recordPenaltyPayment({
        borrow_id: targetTicket.id,
        staff_id: staffs[0].id,
        amount_paid: targetTicket.remaining_debt + 1000,
        payment_method: 'CASH',
      }),
    (err) => err.statusCode === 400 && err.code === 'EXCEEDS_DEBT'
  );

  const part1 = await recordPenaltyPayment({
    borrow_id: targetTicket.id,
    staff_id: staffs[0].id,
    amount_paid: 50000,
    payment_method: 'CASH',
    note: 'Thu thử đợt 1',
  });
  assert.equal(part1.ticket.penalty_status, 'PARTIAL');

  const part2 = await recordPenaltyPayment({
    borrow_id: targetTicket.id,
    staff_id: staffs[1].id,
    amount_paid: part1.ticket.remaining_debt,
    payment_method: 'BANK_TRANSFER',
    note: 'Thu nốt phần còn lại',
  });
  assert.equal(part2.ticket.penalty_status, 'PAID');
  assert.equal(part2.ticket.remaining_debt, 0);

  const ticketPayments = await listPenaltyPayments({ borrowId: targetTicket.id });
  assert.equal(ticketPayments.length, 2);

  console.log('ALL SERVICE TESTS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
