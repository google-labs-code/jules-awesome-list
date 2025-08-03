import React, { useState } from 'react';

const LoginPage = ({ school, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>تسجيل دخول طالب المدرسة</h2>
      <div>
        <label>اسم المدرسة</label>
        <input type="text" value={school} readOnly />
      </div>
      <div>
        <label>اسم المستخدم</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>كلمة المرور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">دخول</button>
    </form>
  );
};

export default LoginPage;
