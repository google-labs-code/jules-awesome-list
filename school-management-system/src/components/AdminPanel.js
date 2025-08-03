import React from 'react';

const AdminPanel = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>This is the admin panel. More features will be added soon.</p>
      <div>
        <button>📅 الجدول الدراسي</button>
        <button>🚨 مخالفات الطالب</button>
        <button>📋 الحضور والغياب</button>
        <button>📊 النتائج الدراسية</button>
        <button>📝 الواجبات المنزلية</button>
        <button>👥 التواصل مع المعلمين</button>
      </div>
    </div>
  );
};

export default AdminPanel;
