console.log('image.js running');
const WHEEL_PRESS_COUNTER_ATTRIBUTE = 'wheelPressCounter';

function pressingScrollButtonOnImage() {
    const currentActiveImage = document.querySelector('div.ux-image-carousel-item.image-treatment.active.image')!;
    let wheelPressCounter = Number(currentActiveImage?.getAttribute(WHEEL_PRESS_COUNTER_ATTRIBUTE));
    if (wheelPressCounter) {
        wheelPressCounter = (Number(wheelPressCounter) + 1) % 4;
    } else {
        wheelPressCounter = 1;
    }
    currentActiveImage.setAttribute(WHEEL_PRESS_COUNTER_ATTRIBUTE, String(wheelPressCounter));
    //currentActiveImage.style.transform = `rotate(${90 * wheelPressCounter}deg)`;


    currentActiveImage.setAttribute("style", `transform: rotate(${90 * wheelPressCounter}deg)`)
}

export function addItemBookmarkEvent() {
    window.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
            pressingScrollButtonOnImage();
        }
    });
}
