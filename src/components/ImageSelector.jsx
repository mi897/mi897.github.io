import React, { useState, useEffect } from 'react';

/**
 * ImageSelector - A React component for selecting and displaying a random image
 *
 * Props:
 *   items: An array of objects with the following properties:
 *     image_url: The URL of the image to display
 *     image_caption: The caption for the image
 *     article_url: The URL of the article associated with the image
 *
 * State:
 *   currentItem: The currently selected item (null if no item is selected)
 *   textColor: The color of the text to display (black or white)
 *
 * Effects:
 *   Analyze the brightness of the current image and adjust the text color
 *   Open the article in a new tab when the button is clicked
 *
 * Returns a JSX element displaying the current image and caption, with buttons to
 * load a random image and open the article in a new tab.
 */
const ImageSelector = ({ items }) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [textColor, setTextColor] = useState('black'); // Default text color

  // Function to randomly select an item
  const selectRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIndex]);
  };

  // Analyze image brightness and adjust text color
  const analyzeImageBrightness = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // To avoid CORS issues
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get image data (we’ll use only a portion for better performance)
      const { data } = ctx.getImageData(0, 0, img.width, img.height);

      // Calculate average brightness
      let totalBrightness = 0;
      let pixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        // Average the RGB values for brightness
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalBrightness += brightness;
        pixelCount++;
      }

      const averageBrightness = totalBrightness / pixelCount;

      // Adjust text color based on brightness
      setTextColor(averageBrightness > 128 ? 'black' : 'white');
    };
  };

  // React to changes in the selected image
  useEffect(() => {
    if (currentItem) {
      analyzeImageBrightness(currentItem.image_url);
    }
  }, [currentItem]);

  // Open the article in a new tab
  const openArticle = () => {
    if (currentItem && currentItem.article_url) {
      window.open(currentItem.article_url, '_blank');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {currentItem ? (
        <div>
          <img
            src={currentItem.image_url}
            alt={currentItem.image_caption}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }}
          />
          <p
            style={{
              margin: '10px 0',
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: textColor, // Dynamic text color
              transition: 'color 0.3s ease', // Smooth transition
            }}
          >
            {currentItem.image_caption}
          </p>
        </div>
      ) : (
        <p style={{ fontSize: '1.2rem' }}>Click the button to load a random image!</p>
      )}

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={selectRandomItem}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Show Random Image
        </button>
        <button
          onClick={openArticle}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          disabled={!currentItem}
        >
          Open Article
        </button>
      </div>
    </div>
  );
};

export default ImageSelector;
