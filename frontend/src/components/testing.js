import React, { useState, useCallback, useEffect } from 'react';

const ImageTextInput = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleTextChange = useCallback((e) => {
    setText(e.target.innerText);
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setImage(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageMove = useCallback((e) => {
    setPosition({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
  }, []);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        // Handle image loading if needed
      };
    }
  }, [image]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div
        contentEditable
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          minHeight: '100px',
          position: 'relative',
        }}
        onInput={handleTextChange}
      >
        {image && (
          <img
            src={image}
            alt="Uploaded"
            style={{
              position: 'absolute',
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: '50px', // adjust as needed
              height: '50px', // adjust as needed
            }}
            onMouseMove={handleImageMove}
            draggable={false}
          />
        )}
        {text}
      </div>
    </div>
  );
};

export default ImageTextInput;
