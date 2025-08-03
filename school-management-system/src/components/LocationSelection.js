import React, { useState } from 'react';

const LocationSelection = ({ onLocationSelect }) => {
  const [location, setLocation] = useState({
    province: '',
    district: '',
    subDistrict: '',
    area: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLocationSelect(location);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>اختيار المحافظه</h2>
      <select name="province" value={location.province} onChange={handleChange}>
        <option value="">اختر المحافظة</option>
        <option value="baghdad">بغداد</option>
        {/* Add other provinces here */}
      </select>

      <h2>القضاء</h2>
      <select name="district" value={location.district} onChange={handleChange}>
        <option value="">اختر القضاء</option>
        <option value="karkh">الكرخ</option>
        {/* Add other districts here */}
      </select>

      <h2>الناحيه</h2>
      <select name="subDistrict" value={location.subDistrict} onChange={handleChange}>
        <option value="">اختر الناحية</option>
        <option value="mansour">المنصور</option>
        {/* Add other sub-districts here */}
      </select>

      <h2>المنطقه</h2>
      <select name="area" value={location.area} onChange={handleChange}>
        <option value="">اختر المنطقة</option>
        <option value="al-jamiaa">الجامعة</option>
        {/* Add other areas here */}
      </select>

      <button type="submit">التالي</button>
    </form>
  );
};

export default LocationSelection;
