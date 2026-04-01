import React, { useEffect } from 'react';

const Head = ({ title }) => {
  useEffect(() => {
    document.title = `P3M | ${title}`;
  }, [title]);

  return null;
};

export default Head;