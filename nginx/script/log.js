//Author: Mason Casebeer

const routine1 = {
    name: 'Push Day',
    exercises: [
        "Bench",
        "Curl",
        "OHP"
    ]
}

const routine2 = {
    name: 'Pull Day',
    exercises: [
        "Row",
        "Lat Pulldown",
        "Barbell Curl"
    ]
}

const routines = [routine1,routine2]

arrayLength = routines.length;

const component = document.querySelector(".log");

const log = () => {
    const form = document.createElement("form");
    const selector = document.createElement("select");
    const submit = document.createElement("input");
    form.setAttribute('id', 'log-form');
    submit.type = "submit";
    submit.value = "Submit";
    selector.name = "workout";
    selector.setAttribute('class', 'log-button');
    submit.setAttribute('class', ',log-button');
    selector.appendChild(document.createElement("option"));

    const label = document.createElement("label");

    for (let i = 0; i < arrayLength; i++) {
        const workout = document.createElement("option");
        workout.value = i;
        workout.innerHTML = routines[i].name;
        selector.appendChild(workout);
    }

    selector.addEventListener("change", (event) => {
        form.replaceChildren();
        const index = event.target.value;
        const workout = routines[event.target.value];
        const label_box = document.createElement("label-box")
        label_box.setAttribute('id','label-box');
        
        const name_col = document.createElement("div");
        name_col.setAttribute('class', 'form-col');
        const set_col = document.createElement("div");
        set_col.setAttribute('class', 'form-col');
        const reps_col = document.createElement("div");
        reps_col.setAttribute('class', 'form-col');
        const weight_col = document.createElement("div");
        weight_col.setAttribute('class', 'form-col');

        for (let j = 0; j < routines[index].exercises.length; j++) {
            const label = document.createElement("label");
            label.for = workout;
            label.setAttribute('class', 'exercise');
            const setlabel = document.createElement("label");
            const replabel = document.createElement("label");
            const weightlabel = document.createElement("label");
            setlabel.innerHTML = "Sets:";
            replabel.innerHTML = "Reps:";
            weightlabel.innerHTML = "Weight:";
            const sets = document.createElement("input");
            const reps = document.createElement("input");
            const weight = document.createElement("input");
            sets.setAttribute('name', workout + '-sets');
            reps.setAttribute('name', workout + '-reps');
            weight.setAttribute('name', workout + '-weight');

            label.innerHTML = workout.exercises[j] + ": ";
            name_col.appendChild(label);
            set_col.appendChild(setlabel);
            set_col.appendChild(sets);
            reps_col.appendChild(replabel);
            reps_col.appendChild(reps);
            weight_col.appendChild(weightlabel);
            weight_col.appendChild(weight);
        }
        label_box.appendChild(name_col);
        label_box.appendChild(set_col);
        label_box.appendChild(reps_col);
        label_box.appendChild(weight_col);
        form.appendChild(label_box);
    });

    submit.addEventListener("click", (event) => {
        event.preventDefault();
        //normally this would submit the form to the backend database, but since we don't have a backend yet, it just clears the form
        //TODO mason implement backend and connect form to database
        form.replaceChildren();
    });
    const selectbox = document.createElement("div");
    selectbox.setAttribute('id', 'selectbox');
    selectbox.appendChild(selector);
    selectbox.appendChild(submit);
    component.appendChild(selectbox);
    component.appendChild(form);
}

log();