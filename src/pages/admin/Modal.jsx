const Modal = ({ title, form, setForm, onClose, onSubmit }) => {
  const updateRoom = (index, key, value) => {
    const updated = [...form.rooms];
    updated[index][key] = value;
    setForm({ ...form, rooms: updated });
  };

  // ===== ADD ROOM =====
  const addRoom = () => {
    setForm({
      ...form,
      rooms: [
        ...form.rooms,
        {
          roomType: "",
          capacity: "",
          pricePerNight: "",
          totalRooms: "",
        },
      ],
    });
  };

  const removeRoom = (index) => {
    const updated = form.rooms.filter((_, i) => i !== index);
    setForm({ ...form, rooms: updated });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg space-y-3 w-full max-w-135 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-bold text-xl text-chatcoal">{title}</h2>

        <div className="relative p-2">
          <label className="form-label ">Hotel Name</label>
          <input
            placeholder="Hotel Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="form-input w-full"
          />
        </div>

        <div className="relative p-2">
          <label className="form-label">Hotel Description</label>
          <textarea
            rows={4}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="form-input w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative p-2">
            <label className="form-label">City</label>
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="form-input w-full"
            />
          </div>

          <div className="relative p-2">
            <label className="form-label">Country</label>
            <input
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="form-input w-full"
            />
          </div>
        </div>
        <div className="relative p-2">
          <label className="form-label">Address</label>
          <textarea
            rows={4}
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="form-input w-full"
          />
        </div>

        {/* ===== ROOM ===== */}
        {form.rooms.map((r, i) => (
          <div key={i} className="space-y-3 ">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Room {i + 1}</h2>

              {form.rooms.length > 1 && (
                <button
                  onClick={() => removeRoom(i)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative p-2">
                <label className="form-label">Room Type</label>
                <input
                  placeholder="Room Type"
                  value={r.roomType}
                  onChange={(e) => updateRoom(i, "roomType", e.target.value)}
                  className="form-input w-full"
                />
              </div>

              <div className="relative p-2">
                <label className="form-label">Capacity</label>
                <input
                  placeholder="Capacity"
                  value={r.capacity}
                  onChange={(e) => updateRoom(i, "capacity", e.target.value)}
                  className="form-input w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative p-2">
                <label className="form-label">Price per Night</label>
              <input
                placeholder="Price"
                value={r.pricePerNight}
                onChange={(e) => updateRoom(i, "pricePerNight", e.target.value)}
                className="form-input w-full"
                />
                </div>

              <div className="relative p-2">
                <label className="form-label">Total Rooms</label>
              <input
                placeholder="Total Rooms"
                value={r.totalRooms}
                onChange={(e) => updateRoom(i, "totalRooms", e.target.value)}
                className="form-input w-full"
              />
              </div>
            </div>
          </div>
        ))}
        <div className="px-2">
        <button
          onClick={addRoom}
          className="bg-pumpkin hover:bg-pumpkin-100 text-white px-3 py-2 rounded"
        >
          + Add Room
        </button>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-300 text-charcoal rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-3 py-2 bg-charcoal text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
