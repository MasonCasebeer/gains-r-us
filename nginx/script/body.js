//author: Mason Casebeer

const workout1 = {
    name: 'Push Day',
    id: 1
};

const exercise1 = {
    name: 'Bench',
    id: 1,
    muscle_group: 'Upper Body',
};
const set1 = {
    workout: 1,
    sets: 3,
    reps: 10,
    weight: 135,
    exercise_id: 1
};

const workouts = [workout1];
const exercises = [exercise1];
const sets = [set1];

const body_component = document.querySelector(".body");

const body = () => {
    //Calclate soreness of muscle groups based on sets and exercises
    const muscleGroups = {
        'Upper Body': 0,
        'Lower Body': 0,
        'Core': 0
    };
    //arbitraryish total volume limits for muscle groups 
    const muscleLimits = {
        'Upper Body': 10000,
        'Lower Body': 20000,
        'Core': 50000
    }

    for (let i = 0; i < sets.length; i++) {
        const exerciseId = sets[i].exercise_id;
        const exercise = exercises.find(ex => ex.id === exerciseId);
        const muscleGroup = exercise.muscle_group;
        //calculate total sets*reps*weight (aka total volume)
        if (muscleGroups[muscleGroup]) {
            muscleGroups[muscleGroup] += sets[i].sets * sets[i].reps * sets[i].weight;
        } else {
            muscleGroups[muscleGroup] = sets[i].sets * sets[i].reps * sets[i].weight;
        }
    }

    //Display soreness of muscle groups
    for (const muscleGroup in muscleGroups) {
        const soreness = muscleGroups[muscleGroup];
        const muscleGroupElement = document.createElement("div");
        //soreness = percent of weight limit for muscle group
        const muscleSoreness = Math.min(soreness / muscleLimits[muscleGroup], 1) * 100; 
        muscleGroupElement.setAttribute("class", "body-part");
        //opacity based on soreness. min of 20% if no soreness and 100% if max or above limit
        muscleGroupElement.style.backgroundColor = `rgba(110, 135, 203, ${.2+ (muscleSoreness / 80) })`; 

        muscleGroupElement.innerHTML = `${muscleGroup}: ${muscleSoreness.toFixed(2)}% sore`;
        body_component.appendChild(muscleGroupElement);
    }
}

body();