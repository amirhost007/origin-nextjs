import React, { useState } from 'react';

const ReadMoreComponent = ({ text, maxLength }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleTextDisplay = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div>
      {showFullText ? (
        <p>{text}</p>
      ) : (
        <p>{text.slice(0, maxLength)}...</p>
      )}
      {text.length > maxLength && (
        <button onClick={toggleTextDisplay}>
          {showFullText ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default ReadMoreComponent;