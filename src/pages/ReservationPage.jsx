import { useEffect, useMemo, useState } from 'react';
import { ClockIcon } from '../components/common/Icons';
import QueueTable from '../components/reservation/QueueTable';
import ReserveForm from '../components/reservation/ReserveForm';
import { useLab } from '../context/LabContext';
import { parseApiError } from '../services/api';

export default function ReservationPage() {
  const { equipment, reservations, createReservation, cancelReservation } = useLab();

  const defaultEq =
    equipment.find((eq) => eq.remaining === 0)?.id || equipment[0]?.id || '';
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(defaultEq);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!equipment.some((eq) => eq.id === selectedEquipmentId) && equipment[0]) {
      setSelectedEquipmentId(
        equipment.find((eq) => eq.remaining === 0)?.id || equipment[0].id
      );
    }
  }, [equipment, selectedEquipmentId]);

  const selectedEquipment = useMemo(
    () => equipment.find((eq) => eq.id === selectedEquipmentId) || equipment[0],
    [equipment, selectedEquipmentId]
  );

  const queueItems = useMemo(
    () => reservations.filter((item) => item.equipmentId === selectedEquipmentId),
    [reservations, selectedEquipmentId]
  );

  const handleCancel = async (id) => {
    setActionError('');
    try {
      await cancelReservation(id);
    } catch (err) {
      setActionError(parseApiError(err, 'Không thể hủy đặt trước.').message);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-3">
        <span className="lab-icon-box bg-info-subtle text-info-emphasis">
          <ClockIcon size={20} />
        </span>
        <div>
          <h1 className="h4 fw-bold mb-0">Phần 2C. Đặt trước và hàng chờ</h1>
          <p className="text-muted small mb-0">
            Quản lý đặt trước thiết bị hết hàng và theo dõi thứ tự hàng chờ nhận thiết bị
          </p>
        </div>
      </div>

      {actionError && (
        <div className="alert alert-danger border-0 py-2" role="alert">
          {actionError}
        </div>
      )}

      <ReserveForm
        equipmentList={equipment}
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={setSelectedEquipmentId}
        onCreateReservation={createReservation}
      />

      <QueueTable
        equipmentName={selectedEquipment?.name || 'Thiết bị'}
        items={queueItems}
        onCancel={handleCancel}
      />
    </>
  );
}
