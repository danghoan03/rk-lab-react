import { PlusIcon, SearchIcon } from '../common/Icons';

export default function EquipmentToolbar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onAddClick,
}) {
  return (
    <div className="card lab-card mb-3">
      <div className="card-body p-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <SearchIcon size={16} />
              </span>
              <input
                type="search"
                className="form-control border-start-0 ps-0"
                placeholder="Tìm theo tên hoặc mã thiết bị..."
                aria-label="Tìm thiết bị"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              aria-label="Lọc theo loại"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="all">Tất cả loại thiết bị</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 text-md-end">
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-1 w-100 w-md-auto px-3 shadow-sm"
              onClick={onAddClick}
            >
              <PlusIcon size={16} />
              <span>Thêm thiết bị</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
