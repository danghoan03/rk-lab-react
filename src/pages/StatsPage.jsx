import { useEffect, useMemo, useState } from 'react';
import { ChartIcon } from '../components/common/Icons';
import PenaltyStatsCards from '../components/fine/PenaltyStatsCards';
import IdleEquipmentList from '../components/stats/IdleEquipmentList';
import MonthlyChart from '../components/stats/MonthlyChart';
import StatCards from '../components/stats/StatCards';
import TopEquipmentTable from '../components/stats/TopEquipmentTable';
import { useLab } from '../context/LabContext';
import { fetchPenaltySummary } from '../services/penaltyService';

export default function StatsPage() {
  const { equipment, borrows, monthlyStats } = useLab();
  const [penaltySummary, setPenaltySummary] = useState(null);

  useEffect(() => {
    let active = true;
    fetchPenaltySummary()
      .then((data) => {
        if (active) setPenaltySummary(data);
      })
      .catch(() => {
        // Bỏ qua nếu backend chưa kết nối
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalUnits = equipment.reduce((sum, eq) => sum + eq.total, 0);
    const borrowedUnits = equipment.reduce(
      (sum, eq) => sum + (eq.total - eq.remaining),
      0
    );
    const overdueCount = borrows.filter((b) => b.status === 'overdue').length;
    const idleItems = equipment.filter((eq) => eq.borrowCount <= 1);
    const topItems = [...equipment]
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);

    return {
      totalUnits,
      borrowedUnits,
      overdueCount,
      idleItems,
      topItems,
    };
  }, [equipment, borrows]);

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-3">
        <span className="lab-icon-box bg-primary-subtle text-primary">
          <ChartIcon size={20} />
        </span>
        <div>
          <h1 className="h4 fw-bold mb-0">Phần 2B. Thống kê và báo cáo</h1>
          <p className="text-muted small mb-0">
            Tổng hợp số liệu thiết bị, công nợ tiền phạt và xu hướng sử dụng theo tháng
          </p>
        </div>
      </div>

      <StatCards
        totalUnits={stats.totalUnits}
        borrowedUnits={stats.borrowedUnits}
        overdueCount={stats.overdueCount}
        idleCount={stats.idleItems.length}
      />

      {penaltySummary && (
        <div className="mb-2">
          <h2 className="h6 fw-bold text-secondary text-uppercase mb-2">
            Thống kê tiền phạt &amp; công nợ quá hạn
          </h2>
          <PenaltyStatsCards summary={penaltySummary} />
        </div>
      )}

      <div className="row g-3">
        <div className="col-lg-7">
          <TopEquipmentTable items={stats.topItems} />
        </div>
        <div className="col-lg-5">
          <IdleEquipmentList items={stats.idleItems} />
        </div>
      </div>

      <MonthlyChart data={monthlyStats} />
    </>
  );
}
