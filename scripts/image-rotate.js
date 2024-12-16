
let wheelPressCounter = 0;

function pressingScrollButtonOnImage() {
    const currentActiveImage = document.querySelector('div.ux-image-carousel-item,image-treatment,active,image');
    wheelPressCounter = (wheelPressCounter + 1) % 4;
    currentActiveImage.style.transform = `rotate(${90 * wheelPressCounter}deg)`;
}

window.addEventListener('mousedown', (event) => {
    if (event.button === 1) {
        pressingScrollButtonOnImage();
    }
});