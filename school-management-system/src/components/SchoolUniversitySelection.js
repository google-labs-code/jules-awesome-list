import React, { useState } from 'react';

const SchoolUniversitySelection = ({ userType, onSelect }) => {
  const [selection, setSelection] = useState('');

  const schools = ['المدرسة الابتدائية النموذجية', 'مدرسة المتفوقين الثانوية'];
  const universities = ['جامعة بغداد', 'الجامعة التكنولوجية'];

  const options = userType === 'school' ? schools : universities;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSelect(selection);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        {userType === 'school'
          ? 'المدرسه'
          : 'جامعه'}
      </h2>
      <select value={selection} onChange={(e) => setSelection(e.target.value)}>
        <option value="">
          {userType === 'school'
            ? 'اختر المدرسة'
            : 'اختر الجامعة'}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <button type="submit">التالي</button>
    </form>
  );
};

export default SchoolUniversitySelection;
