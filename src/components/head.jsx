import React, { useEffect } from 'react';

const Head = ({ title }) => {
  useEffect(() => {
    // Menggunakan backtick dan ${} untuk memasukkan variabel
    document.title = `P3M | ${title}`;
  }, [title]);

  return null;
};

export default Head;