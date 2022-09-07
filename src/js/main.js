const generateBtn = document.querySelector('#generate-lift-simulator');
const floorCount = document.querySelector('#number-of-floors');
const liftCount = document.querySelector('#number-of-lifts');

function generateSimulator() {
    const floorCounter = floorCount.value;
    const liftCounter = liftCount.value;
    console.log(floorCounter, liftCounter);
}

generateBtn.addEventListener('click', generateSimulator);