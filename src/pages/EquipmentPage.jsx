import { useCallback, useEffect, useState } from 'react';
import { BoxIcon } from '../components/common/Icons';
import Pagination from '../components/common/Pagination';
import { ErrorState, LoadingState } from '../components/common/StatusView';
import ConfirmDeleteModal from '../components/equipment/ConfirmDeleteModal';
import EquipmentDetailModal from '../components/equipment/EquipmentDetailModal';
import EquipmentFormModal from '../components/equipment/EquipmentFormModal';
import EquipmentTable from '../components/equipment/EquipmentTable';
import EquipmentToolbar from '../components/equipment/EquipmentToolbar';
import { useLab } from '../context/LabContext';
import { EQUIPMENT_CATEGORIES } from '../data/mockData';
import { parseApiError } from '../services/api';
import {
  createEquipmentApi,
  deleteEquipmentApi,
  fetchEquipments,
  updateEquipmentApi,
} from '../services/equipmentService';

const PAGE_SIZE = 6;

export default function EquipmentPage() {
  const { refreshFromApi } = useLab();

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [detailId, setDetailId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const loadEquipments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchEquipments({
        search: searchTerm,
        category: selectedCategory,
        page: currentPage,
        limit: PAGE_SIZE,
      });
      setItems(response.data || []);
      setMeta(
        response.meta || { page: currentPage, limit: PAGE_SIZE, total: 0, totalPages: 1 }
      );
    } catch (err) {
      setError(parseApiError(err, 'Không tải được danh sách thiết bị.').message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, currentPage]);

  useEffect(() => {
    loadEquipments();
  }, [loadEquipments]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormModalOpen(true);
  };

  const handleSubmitForm = async (payload) => {
    if (editingItem) {
      await updateEquipmentApi(editingItem.id, payload);
    } else {
      await createEquipmentApi(payload);
      setCurrentPage(1);
    }
    await loadEquipments();
    await refreshFromApi();
  };

  const handleConfirmDelete = async (id) => {
    await deleteEquipmentApi(id);
    await loadEquipments();
    await refreshFromApi();
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex align-items-center gap-3">
          <span className="lab-icon-box bg-primary-subtle text-primary">
            <BoxIcon size={20} />
          </span>
          <div>
            <h1 className="h4 fw-bold mb-0">Quản lý thiết bị</h1>
            <p className="text-muted small mb-0">
              Tra cứu tồn kho khả dụng, cập nhật số lượng và quản lý danh mục phòng Lab
            </p>
          </div>
        </div>
      </div>

      <EquipmentToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={EQUIPMENT_CATEGORIES}
        onAddClick={handleOpenAdd}
      />

      {loading && <LoadingState message="Đang tải danh sách thiết bị..." />}

      {!loading && error && <ErrorState message={error} onRetry={loadEquipments} />}

      {!loading && !error && (
        <>
          <EquipmentTable
            items={items}
            onViewDetail={(item) => setDetailId(item.id)}
            onEdit={handleOpenEdit}
            onDelete={(item) => setDeletingItem(item)}
          />

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            itemLabel="thiết bị"
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <EquipmentDetailModal
        equipmentId={detailId}
        onClose={() => setDetailId(null)}
      />

      <EquipmentFormModal
        show={formModalOpen}
        initialData={editingItem}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      <ConfirmDeleteModal
        show={Boolean(deletingItem)}
        equipment={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
