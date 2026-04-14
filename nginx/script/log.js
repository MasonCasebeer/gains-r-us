//Author: Mason Casebeer

// const routine1 = {
//     name: 'Push Day',
//     exercises: [
//         "Bench",
//         "Curl",
//         "OHP"
//     ]
// }

// const routine2 = {
//     name: 'Pull Day',
//     exercises: [
//         "Row",
//         "Lat Pulldown",
//         "Barbell Curl"
//     ]
// }

// // const routines = [routine1,routine2]

// // arrayLength = routines.length;

const component = document.querySelector(".log");

var routines
const getRoutines = async () => {
    const response = await fetch("/api/routines", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const raw_routines = await response.json();

    //reduce is kind of like a reverse map (array -> single element) - mason
    routines = raw_routines.reduce((acc, row) => {
        const existing = acc.find(r => r.routineid === row.routineid);
        
        if (existing) {
            // Add exercise to existing routine
            existing.exercises.push(
                {
                    exercise_name: row.exercise_name,
                    exerciseid: row.exerciseid
                }
            );
        } else {
            // Create new routine with first exercise
            acc.push({
                routineid: row.routineid,
                name: row.routine_name,
                type: row.type,
                exercises: [
                        {
                            exercise_name: row.exercise_name,
                            exerciseid: row.exerciseid
                        }
                ] 
            });
        }
        return acc;
    }, []);
}

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

    for (let i = 0; i < routines.length; i++) {
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

            label.innerHTML = workout.exercises[j].exercise_name + ": ";
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

    submit.addEventListener("click", async (event) => {
        event.preventDefault();
        
        const setData = [];
        const setInputs = form.querySelectorAll("input[name$='-sets']");
        const repInputs = form.querySelectorAll("input[name$='-reps']");
        const weightInputs = form.querySelectorAll("input[name$='-weight']");

        const routineInfo = selector.value;

        for (let i = 0; i < setInputs.length; i ++) {
            setData.push({
                sets: setInputs[i].value,
                reps: repInputs[i].value,
                weight: weightInputs[i].value
            });
        }


        // console.log("Set data:", setData);

        //handle admin submission behavior
        if(document.getElementById("display-area")) {

            userEntry = document.getElementById("user").value;

            const workoutData = {
                userid: userEntry,
                routineid: routines[selector.value].routineid,
            }

            const info = {workoutData: workoutData};
            console.log("Creating workout + sets with info:", info);

            fetch("/api/log-workout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ info }),
            })
            .then(response => response.json())
            .then(data => {
                const workoutId = data.workoutId;
                console.log("Creating sets with routines[routineInfo]:", routines[routineInfo]);

                for (let i = 0; i < setData.length; i++) {
                    const setInfo = {
                        workoutid: workoutId,
                        exerciseid: routines[routineInfo].exercises[i].exerciseid,
                        sets: setData[i].sets,
                        reps: setData[i].reps,
                        weight: setData[i].weight
                    }
                    console.log("Set info:", setInfo);
                    fetch("/api/log-set", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ setInfo }),
                    });
                }
            })
            .catch(error => console.error("Error:", error));


        }

        form.replaceChildren();
        selector.value = "";
    });

    const selectbox = document.createElement("div");
    selectbox.setAttribute('id', 'selectbox');
    selectbox.appendChild(selector);
    selectbox.appendChild(submit);
    component.appendChild(selectbox);
    component.appendChild(form);
}

getRoutines().then(() => {
    log();
});