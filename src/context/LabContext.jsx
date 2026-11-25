import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BORROWS,
  INITIAL_EQUIPMENT,
  INITIAL_RESERVATIONS,
  INITIAL_USERS,
  MONTHLY_BORROW_STATS,
  calculateOverdueDays,
  formatDateVN,
  getTodayISO,
} from '../data/mockData';
import {
  fetchDemoUserApi,
  fetchUserByIdApi,
  loginApi,
  registerApi,
} from '../services/authService';
import { fetchBorrowings, returnBorrowingApi } from '../services/borrowingService';
import { fetchEquipments } from '../services/equipmentService';
import { fetchFineSummary, updateFineRateApi } from '../services/fineService';
import {
  cancelReservationApi,
  createReservationApi,
  fetchReservations,
} from '../services/reservationService';

const LabContext = createContext(null);
const SESSION_KEY = 'rikkei_lab_user_id';

function mapApiEquipment(item) {
  return {
    id: String(item.id),
    code: item.code,
    name: item.name,
    category: item.category || 'Khác',
    total: item.total_quantity,
    remaining: item.remaining_quantity,
    borrowCount: item.borrow_count ?? 0,
  };
}

function mapApiBorrow(item) {
  return {
    id: item.code_label || `PM-${String(item.id).padStart(3, '0')}`,
    apiId: item.id,
    equipmentId: String(item.equipment_id),
    equipmentName: item.equipment_name,
    borrowerName: item.borrower_name,
    quantity: item.quantity,
    borrowDate: String(item.borrowed_at || '').slice(0, 10),
    dueDate: item.due_date,
    returnDate: item.returned_at ? String(item.returned_at).slice(0, 10) : null,
    status: item.status,
    note: item.note || '',
    finePaid: item.fine_paid ?? 0,
  };
}

function mapApiReservation(item) {
  return {
    id: String(item.id),
    apiId: item.id,
    equipmentId: String(item.equipment_id),
    equipmentName: item.equipment_name,
    requesterName: item.requester_name,
    quantity: item.quantity,
    createdAt: formatDateVN(item.created_at),
    status: item.status,
  };
}

function mapApiUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
  };
}

export function LabProvider({ children }) {
  const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT);
  const [borrows, setBorrows] = useState(INITIAL_BORROWS);
  const [fineRate, setFineRateState] = useState(5000);
  const [baseCollectedFine, setBaseCollectedFine] = useState(1180000);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[1]);

  const refreshFromApi = useCallback(async () => {
    try {
      const [eqRes, borrowRes, fineSummary, reserveRes] = await Promise.all([
        fetchEquipments({ page: 1, limit: 100 }),
        fetchBorrowings('all'),
        fetchFineSummary(),
        fetchReservations(),
      ]);

      if (Array.isArray(eqRes?.data)) {
        setEquipment(eqRes.data.map(mapApiEquipment));
      }
      if (Array.isArray(borrowRes)) {
        setBorrows(borrowRes.map(mapApiBorrow));
      }
      if (fineSummary) {
        setFineRateState(fineSummary.fine_rate);
        setBaseCollectedFine(fineSummary.base_collected_fine);
      }
      if (Array.isArray(reserveRes)) {
        setReservations(reserveRes.map(mapApiReservation));
      }
    } catch {
      // Giữ dữ liệu hiện tại nếu API chưa sẵn sàng
    }
  }, []);

  useEffect(() => {
    refreshFromApi();

    const savedUserId = localStorage.getItem(SESSION_KEY);
    if (savedUserId === 'none') {
      setCurrentUser(null);
      return;
    }
    if (savedUserId) {
      fetchUserByIdApi(savedUserId)
        .then((user) => setCurrentUser(mapApiUser(user)))
        .catch(() => {
          localStorage.removeItem(SESSION_KEY);
        });
    }
  }, [refreshFromApi]);

  const saveFineRate = async (newRate) => {
    const res = await updateFineRateApi(newRate);
    setFineRateState(res.data.fine_rate);
    setBaseCollectedFine(res.data.base_collected_fine);
    return res;
  };

  const returnBorrow = async (borrowId, fineAmount = null) => {
    const target = borrows.find((b) => b.id === borrowId);
    if (!target || target.status === 'returned') return;

    const today = getTodayISO();
    const overdueDays = calculateOverdueDays(target.dueDate, today);
    const calculatedFine =
      fineAmount !== null ? fineAmount : overdueDays * target.quantity * fineRate;

    if (target.apiId) {
      await returnBorrowingApi(target.apiId, calculatedFine);
      await refreshFromApi();
      return;
    }

    setBorrows((prev) =>
      prev.map((b) =>
        b.id === borrowId
          ? {
              ...b,
              status: 'returned',
              returnDate: today,
              finePaid: calculatedFine,
            }
          : b
      )
    );
  };

  const createReservation = async ({ equipmentId, requesterName, quantity }) => {
    const res = await createReservationApi({
      equipment_id: equipmentId,
      requester_name: requesterName,
      quantity,
    });
    await refreshFromApi();
    return res;
  };

  const cancelReservation = async (reservationId) => {
    const res = await cancelReservationApi(reservationId);
    await refreshFromApi();
    return res;
  };

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    const mapped = mapApiUser(res.data);
    setCurrentUser(mapped);
    localStorage.setItem(SESSION_KEY, String(mapped.id));
    return res;
  };

  const register = async ({ fullName, email, password, role = 'student' }) => {
    const res = await registerApi({
      full_name: fullName,
      email,
      password,
      role,
    });
    const mapped = mapApiUser(res.data);
    setCurrentUser(mapped);
    localStorage.setItem(SESSION_KEY, String(mapped.id));
    return res;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.setItem(SESSION_KEY, 'none');
  };

  const switchDemoRole = async (role) => {
    const user = await fetchDemoUserApi(role);
    const mapped = mapApiUser(user);
    setCurrentUser(mapped);
    localStorage.setItem(SESSION_KEY, String(mapped.id));
  };

  return (
    <LabContext.Provider
      value={{
        equipment,
        borrows,
        fineRate,
        saveFineRate,
        baseCollectedFine,
        reservations,
        monthlyStats: MONTHLY_BORROW_STATS,
        currentUser,
        refreshFromApi,
        returnBorrow,
        createReservation,
        cancelReservation,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const ctx = useContext(LabContext);
  if (!ctx) {
    throw new Error('useLab must be used inside LabProvider');
  }
  return ctx;
}
