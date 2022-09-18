const generateBtn = document.querySelector('#generate-lift-simulator');
const floorCount = document.querySelector('#number-of-floors');
const liftCount = document.querySelector('#number-of-lifts');
const generateSimulatorContainer = document.querySelector('.lift-sim-data__container'); 
const liftSimulator = document.querySelector('.lift-simulator'); 

function generateSimulator() {
    const floorCounter = floorCount.value;
    const liftCounter = liftCount.value;

    if (floorCounter > 8 || floorCounter < 0) {
        alert('Please use Valid Floors : 1 - 8');
        return;
    }

    if (liftCounter > 5 || liftCounter < 0) {
        alert('Please use Valid Lifts : 1 - 5');
        return;
    }

    generateSimulatorContainer.classList.add('hideContent');
    
    createFloors(floorCounter);
    createLifts(liftCounter);
}

function createFloors(floorCount) {
    for(let i = 0; i < floorCount; i++) {
        const floorControlBtns = document.createElement('div')
        floorControlBtns.classList.add('lift-simulator__floor--btns')
        let btnUp = document.createElement('button');
        btnUp.classList.add('lift-simulator__floor--btn-up', 'lift-simulator__floor--btn');
        btnUp.append('Up');
        let btnDown = document.createElement('button');
        btnDown.classList.add('lift-simulator__floor--btn-down', 'lift-simulator__floor--btn');
        btnDown.append('Down');
        floorControlBtns.appendChild(btnUp);
        floorControlBtns.appendChild(btnDown);

        const floor = document.createElement('div');
        floor.classList.add('lift-simulator__floor');
        floor.appendChild(floorControlBtns);
        //some comment
        let text = document.createTextNode(`Floor ${floorCount - i}`);
        floor.setAttribute('data-floor-id', `${floorCount - i}`)
        floor.appendChild(text);
        liftSimulator.appendChild(floor);
        console.log(i);
    }
}

function createLifts(liftCount) {
    const firstFloor = Array.from(
        document.querySelectorAll('.lift-simulator__floor')
    ).pop();

    for (let i = 1; i <= liftCount; i++) {
        const lift = document.createElement('span');
        lift.classList.add('lift-simulator__lift');
        lift.setAttribute('data-id', i);
        lift.style.left = `${i * 100}px`;
        firstFloor.appendChild(lift);
        initLift(lift);
    }
}

function initLift(lift) {
    lift.data = {
        id: lift.getAttribute('data-id'),
        currentFloor: 1,
        direction: 'None',
        state: 'Idle'
    }

    console.log(lift.data);
}

function assignLift(liftDirection, requestFloor) {
    const lifts = Array.from(document.querySelectorAll('.lift-simulator__lift'));
    let assignedLift = null;
    console.log(liftDirection);
    let closestDistance = 100;
    let availableLifts = [];
    if(liftDirection == 'Up') {
        availableLifts = lifts.filter(lift => lift.data.direction == liftDirection 
                                    && lift.data.currentFloor < requestFloor);
    }
    if(liftDirection == 'Down') {
        availableLifts = lifts.filter(lift => lift.data.direction == liftDirection 
                                    && lift.data.currentFloor > requestFloor);
    }
    if(availableLifts.length === 0) {
        availableLifts = lifts.filter(lift => lift.data.direction == 'None');
    }
    if(availableLifts.length === 0) {
        availableLifts = lifts;
    }
    console.log('availableLifts', availableLifts);
    for(const lift of availableLifts) {
        const distance = Math.abs(requestFloor - lift.data.currentFloor); 
        console.log(requestFloor, 'request floor');
        console.log(lift.data.currentFloor, 'lift current floor');
        if(distance < closestDistance) {
            closestDistance = distance;
            assignedLift = lift;
            console.log(closestDistance, assignedLift);
        }
    }
    return assignedLift;
}

function moveLift(liftDirection, requestFloorID, lift) {
    lift.data.direction = liftDirection;
    lift.data.state = 'moving';
    console.log(requestFloorID,  'update Lift position');
    lift.style.transform = `translateY(${-30 - ((requestFloorID - 1) * 116)}px)`;
    lift.data.currentFloor = requestFloorID;
    if(lift.data.currentFloor == floorCount || lift.data.currentFloor == 1) {
        lift.data.direction = 'None';
    }
    lift.data.state = 'idle';
}

function sendRequest(liftDirection, requestFloorID, requestFloor) {
    const lift = assignLift(liftDirection, requestFloorID);
    moveLift(liftDirection, requestFloorID, lift);
}

generateBtn.addEventListener('click', generateSimulator);
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('lift-simulator__floor--btn')) {
        const liftBtn = e.target;
        const liftDirection = liftBtn.textContent;
        const liftSourceFloor = liftBtn.closest('.lift-simulator__floor');
        const liftSourceFloorID = liftSourceFloor.getAttribute('data-floor-id');
        console.log('lift source floor', liftSourceFloor);
        console.log('lift direction', liftDirection);
        sendRequest(liftDirection, liftSourceFloorID, liftSourceFloor);
    }
});
