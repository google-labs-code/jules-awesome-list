import React from 'react';

const StudentDashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>This is your dashboard. More features will be added soon.</p>
      <div>
        <button>المواد الدراسية</button>
        <button>📊 النتائج الدراسية</button>
        <button>📋 الحضور والغياب</button>
        <button>📚 المواد الدراسية</button>
        <button>📋 التبليغات</button>
        <button>🔔 إشعارات الطالب</button>
        <button>الجدول الدراسي</button>
        <button>الامتحانات</button>
      </div>
    </div>
  );
};

export default StudentDashboard;
