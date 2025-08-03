import React from 'react';

const UserTypeSelection = ({ onSelect }) => {
  return (
    <div>
      <h2>اختر نوع الطالب</h2>
      <button onClick={() => onSelect('school')}>
        👨‍🎓 هل أنت طالب مدرسة؟
      </button>
      <button onClick={() => onSelect('university')}>
        🎓 هل أنت طالب جامعة؟
      </button>
    </div>
  );
};

export default UserTypeSelection;
