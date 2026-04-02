const workout1 = {
    name: 'Push Day',
    exercises: [
        "Bench",
        "Curl",
        "OHP"
    ]
}

const workout2 = {
    name: 'Pull Day',
    exercises: [
        "Row",
        "Lat Pulldown",
        "Barbell Curl"
    ]
}

const workouts = [workout1,workout2]

arrayLength = workouts.length;

const component = document.querySelector(".log");

const log = () => {
    const form = document.createElement("form");
    const selector = document.createElement("select");
    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Submit";
    selector.name = "workout";
    selector.appendChild(document.createElement("option"));

    const label = document.createElement("label");
    for (let i = 0; i < arrayLength; i++) {
        const workout = document.createElement("option");
        workout.value = i;
        workout.innerHTML = workouts[i].name;
        selector.appendChild(workout);
    }

    selector.addEventListener("change", (event) => {
        form.replaceChildren();
        const index = event.target.value;
        const workout = workouts[event.target.value];
        for (let j = 0; j < workouts[index].exercises.length; j++) {
            const label = document.createElement("label");
            label.for = workout;
            const setlabel = document.createElement("label");
            const replabel = document.createElement("label");
            const weightlabel = document.createElement("label");
            setlabel.innerHTML = "Sets:";
            replabel.innerHTML = "Reps:";
            weightlabel.innerHTML = "Weight:";
            const sets = document.createElement("input");
            const reps = document.createElement("input");
            const weight = document.createElement("input");
            sets.setAttribute('id', workout + '-sets');
            reps.setAttribute('id', workout + '-reps');
            weight.setAttribute('id', workout + '-weight');

            label.innerHTML = workout.exercises[j] + ": ";
            form.appendChild(label);
            form.appendChild(setlabel);
            form.appendChild(sets);
            form.appendChild(replabel);
            form.appendChild(reps);
            form.appendChild(weightlabel);
            form.appendChild(weight);
            form.appendChild(document.createElement("br"));
        }
    });
    component.appendChild(selector);
    component.appendChild(form);
    component.appendChild(submit);
}

log();