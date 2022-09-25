const generateBtn = document.querySelector('#generate-lift-simulator');
const floorCount = document.querySelector('#number-of-floors');
const liftCount = document.querySelector('#number-of-lifts');
const generateSimulatorContainer = document.querySelector('.lift-sim-data__container'); 
const liftSimulator = document.querySelector('.lift-simulator'); 

let liftQueueOrder = [];

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
        if(i === 0){
            btnUp.classList.add('invisibleContent');
        }
        let btnDown = document.createElement('button');
        btnDown.classList.add('lift-simulator__floor--btn-down', 'lift-simulator__floor--btn');
        btnDown.append('Down');
        if(i === floorCount - 1){
            btnDown.classList.add('invisibleContent');
        }
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
        const rightDoor = document.createElement('div');
        const leftDoor = document.createElement('div');
        leftDoor.classList.add('lift-simulator__lift--left-door');
        rightDoor.classList.add('lift-simulator__lift--right-door');
        lift.appendChild(rightDoor);
        lift.appendChild(leftDoor);
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
        direction: 'none',
        state: 'idle'
    }

    console.log(lift.data);
}

function assignLift(liftDirection, requestFloor) {
    const lifts = document.querySelectorAll('.lift-simulator__lift');
    let assignedLift = null;
    let closestDistance = 100;
    let availableLifts = Array.from(lifts);
    availableLifts = availableLifts.filter(lift => lift.data.state == 'idle');
    if (availableLifts.length === 0) {
        console.log('Try again to assignLift');
        setTimeout(() => sendRequest(liftDirection, requestFloor),2000);
    }
    else {
        for (let lift of availableLifts) {
            if (lift.data.direction == liftDirection) {
                let distance = Math.abs(lift.data.currentFloor - requestFloor);
                if(liftDirection == 'up') {
                    if(closestDistance > distance && requestFloor > lift.data.currentFloor) {
                        closestDistance = distance;
                        assignedLift = lift;
                    }
                }
                if(liftDirection == 'down') {
                    if(closestDistance > distance && requestFloor < lift.data.currentFloor) {
                        closestDistance = distance;
                        assignedLift = lift;
                    }
                }
            }
        }
        if(assignedLift === null) {
            for (let lift of availableLifts) {
                let distance = Math.abs(lift.data.currentFloor - requestFloor);
                if(closestDistance > distance) {
                    closestDistance = distance;
                    assignedLift = lift;
                }
            }
        }
        console.log("lift available returning", assignedLift);
        return assignedLift;
    }
}

function openCloseDoors(lift) {
    const rightDoor = lift.querySelector('.lift-simulator__lift--right-door');
    const leftDoor = lift.querySelector('.lift-simulator__lift--left-door');
    leftDoor.style.transition = "width 2.5s";
    rightDoor.style.transition = "width 2.5s";
    leftDoor.style.width = "0px";
    rightDoor.style.width = "0px";

    setTimeout(() =>{
        leftDoor.style.transition = "width 2.5s";
        rightDoor.style.transition = "width 2.5s";
        leftDoor.style.width = "49%";
        rightDoor.style.width = "49%";
    }, 2500);
}

function moveLift(liftDirection, requestFloorID, lift) {
    const floorDiff = Math.abs(lift.data.currentFloor - requestFloorID);
    lift.data.direction = liftDirection;
    lift.data.state = 'moving';
    console.log(requestFloorID,  'update Lift position');
    lift.style.transform = `translateY(${-30 - ((requestFloorID - 1) * 116)}px)`;
    lift.style.transitionDuration = `${floorDiff * 2}s`;
    setTimeout(function() {
        openCloseDoors(lift);
    }, floorDiff * 2000);
    
    setTimeout(function() {
        lift.data.currentFloor = requestFloorID;
        lift.data.state = 'idle';
    },floorDiff * 2000 + 5000);
}

function sendRequest(liftDirection, requestFloorID) {
    const lift = assignLift(liftDirection, requestFloorID);
    
    if(lift != null) {
        console.log('Lift found Move it now', lift);
        moveLift(liftDirection, requestFloorID, lift);
    }
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
