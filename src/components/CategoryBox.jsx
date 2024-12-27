import React, { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import qs from 'query-string';

function CategoryBox({ icon: Icon, label, selected }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString()); 
    }

    const updatedQuery = {
      ...currentQuery,
      category: label,
    };

    if (params.get('category') === label) {
      delete updatedQuery.category;
    }

    const url = qs.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      { skipNull: true }
    );

    navigate(url);
  }, [label, params, navigate]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer ${
        selected ? 'border-b-neutral-800' : 'border-transparent'
      } ${selected ? 'text-neutral-800' : 'text-neutral-500'}`}
    >
      <Icon size={27} />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
}

export default CategoryBox;
