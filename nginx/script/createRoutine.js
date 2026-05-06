const submitButton = document.getElementById("submit-routine");
const restartButton = document.getElementById("restart-create");
const routineForm = document.getElementById("routine-form");
const addExerciseBtn = document.getElementById("add-exercise");
const nameInput = document.getElementById("routine-name");
const typeInput = document.getElementById("routine-type");
const userInput = document.getElementById("routine-user");

async function addExercise() {
    //fields are just name and muscle group
    const exercise_row = document.createElement("form");
    const name = document.createElement("input");
    const muscleGroup = document.createElement("select");
    const muscleGroups = ["Upper Body", "Lower Body", "Core"];

    muscleGroups.forEach(group => {
        const option = document.createElement("option");
        option.value = group;
        option.textContent = group;
        muscleGroup.appendChild(option);
    });

    muscleGroup.value = "Upper Body"; // Set default value

    exercise_row.appendChild(name);
    exercise_row.appendChild(muscleGroup);

    name.setAttribute("placeholder", "Exercise Name");
    muscleGroup.setAttribute("placeholder", "Muscle Group");
    routineForm.appendChild(exercise_row);
}

async function exportRoutine() {
    const exerciseForms = routineForm.querySelectorAll("form");
    const exerciseData = [];

    exerciseForms.forEach((form) => {
        const inputs = form.querySelectorAll("input");
        if (inputs.length >= 2) {
            exerciseData.push({
                name: inputs[0].value,
                muscle: inputs[1].value
            });
        }
    });

    const response = await fetch("/api/create-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseData })
    });

    const result = await response.json();
    console.log("Exercises created:", result);

    //now create routine (post request also adds routine-exercise relationships)
    const routineData = {
        name: nameInput.value,
        type: typeInput.value,
        userid: userInput.value,
        exerciseIds: result
    }

    const routineResponse = await fetch("/api/create-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routineData })
    });

    const routineResult = await routineResponse.json();
    console.log("Routine created:", routineResult);
}

addExerciseBtn.addEventListener("click", () => {
    addExercise();
});

submitButton.addEventListener("click", () => {
    exportRoutine();
});

restartButton.addEventListener("click", () => {
    routineForm.replaceChildren(); // Clear all exercises from the form
    alert("Routine creation restarted. All inputs cleared.");
});