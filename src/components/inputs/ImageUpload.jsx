import React, { useState } from 'react';

const ImageUpload = ({ onChange }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };
  
  return (
    <div>
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-auto" />
        ) : (
          <span>Click to upload an image</span>
        )}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
