import React, { useState, useEffect } from "react";

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
  const [currentItem, setCurrentItem] = useState(items[1]);
  const [currentText, setCurrentText] = useState(items[1].image_caption);
  const [textColor, setTextColor] = useState('black'); // Default text color

  // Function to randomly select an item
  const selectRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    if (items[randomIndex] === currentItem) selectRandomItem();
    else if (items[randomIndex].image_caption == "") selectRandomItem();
    else setCurrentItem(items[randomIndex]);
  };

  // Open the article in a new tab
  const openArticle = () => {
    if (currentItem && currentItem.article_url) {
      window.open(currentItem.article_url, "_blank");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {currentItem ? (
        <div>
          <div
            style={{
              height: "500px",
              alignContent : "center",
            }}
          >
            <img
              src={currentItem.image_url}
              alt={currentItem.image_caption}
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                borderRadius: "10px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onLoad={() => {
                const img = document.querySelector("img");
                if (img) {
                  setCurrentText(img.alt);
                }
              }}
            />
          </div>
          <p
            style={{
              margin: "10px 0",
              fontSize: "1.2rem",
              fontStyle: "italic",
              color: "white", // Dynamic text color
            }}
          >
            {currentText}
          </p>
        </div>
      ) : (
        <p style={{ fontSize: "1.2rem" }}>
          Click the button to start chillin w/ curiosity
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={selectRandomItem}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          chill some more
        </button>
        <button
          onClick={openArticle}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          disabled={!currentItem}
        >
          chill deeper
        </button>
      </div>
    </div>
  );
};

export default ImageSelector;
