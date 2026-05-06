import {getLoginStatus} from './loginStatus.js';
const body_component = document.querySelector(".body");
//author: Mason Casebeer

const body = () => {
    //arbitraryish total volume limits for muscle groups 
    body_component.replaceChildren();
    const codedLimits = {
        "Upper Body": 10000,
        "Lower Body": 20000,
        "Core": 5000
    }

    getMuscleGroups().then((muscleGroups) => {
            //Display soreness of muscle groups
            for (const muscleGroup in muscleGroups) {
                // console.log(muscleGroup);
                if(!muscleGroup in codedLimits) {
                    codedLimits[muscleGroup] = 10000;
                }

                const soreness = muscleGroups[muscleGroup];
                const muscleGroupElement = document.createElement("div");
                //soreness = percent of weight limit for muscle group
                const muscleSoreness = Math.min(soreness / codedLimits[muscleGroup], 1) * 100;
                muscleGroupElement.setAttribute("class", "body-part");
                //opacity based on soreness. min of 20% if no soreness and 100% if max or above limit
                muscleGroupElement.style.backgroundColor = `rgba(110, 135, 203, ${.2+ (muscleSoreness / 80) })`; 

                muscleGroupElement.innerHTML = `${muscleGroup}: ${muscleSoreness.toFixed(2)}% sore`;
                body_component.appendChild(muscleGroupElement);
        }
    });
}


async function getMuscleGroups() {

    const muscleGroups = { };

    const data = await getLoginStatus();
    const username = data.user.username;
    const userid = data.user.userid;

    var response;
    response = await fetch(`/api/user-workouts?user=${username}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    
    const users = await response.json();

    var workoutInfo;
    workoutInfo = await fetch(`/api/user/workout-sets/?userid=${userid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const workouts = await workoutInfo.json();



    workouts.forEach((workout) => {
        if (Date.now() - new Date(workout.date).getTime() < 3 * 24 * 60 * 60 * 1000) {
            const group = workout.eercise_muscle;
            // console.log(workout);
            if(!muscleGroups[group]) {
                muscleGroups[group] = 0;
            }
            muscleGroups[group]  = muscleGroups[group] + (workout.sets * workout.reps*workout.weight);
        }
   });
    return muscleGroups;
}

window.addEventListener('workoutSubmitted', (e) => {
    body();
});
body();