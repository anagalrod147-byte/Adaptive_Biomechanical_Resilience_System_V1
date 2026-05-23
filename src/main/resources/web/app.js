let simulationData = [];

let simulationMode =
    "MANUAL";

let strategy =
    "CONSERVATIVE";

let autoInterval = null;

let timelineInterval = null;

let timelineRunning =
    false;

let motionTime = 0;

async function loadSimulation() {

    const response =
        await fetch("simulation.json");

    simulationData =
        await response.json();

    generateControls();

    redrawDashboard();
}

function generateControls() {

    const panel =
        document.getElementById(
            "controlPanel"
        );

    panel.innerHTML = "";

    simulationData.forEach(region => {

        panel.innerHTML +=

            `
        <label>
            ${region.label} LOAD
        </label>

        <input
            type="range"
            min="0"
            max="150"
            value="${region.load}"
            id="${region.id}Load">

        <label>
            ${region.label} COMPENSATION
        </label>

        <input
            type="range"
            min="0"
            max="100"
            value="${region.compensation}"
            id="${region.id}Comp">
        `;
    });

    simulationData.forEach(region => {

        document
            .getElementById(
                `${region.id}Load`
            )
            .addEventListener(
                "input",
                e => {

                    region.load =
                        parseInt(
                            e.target.value
                        );

                    redrawDashboard();
                }
            );

        document
            .getElementById(
                `${region.id}Comp`
            )
            .addEventListener(
                "input",
                e => {

                    region.compensation =
                        parseInt(
                            e.target.value
                        );

                    redrawDashboard();
                }
            );
    });
}

function redrawDashboard() {

    const container =
        document.getElementById(
            "dashboard"
        );

    container.innerHTML = "";

    let totalStress = 0;

    simulationData.forEach(region => {

        let stress =
            region.load
            - region.compensation;

        totalStress += stress;

        let risk = "ESTABLE";
        let color = "blue";
        let glow = "blueGlow";

        if(stress > 80) {

            risk = "ALTO RIESGO";
            color = "red";
            glow = "redGlow";
        }

        else if(stress > 40) {

            risk = "RIESGO MODERADO";
            color = "orange";
            glow = "orangeGlow";
        }

        const card =
            `
        <div class="card ${glow}">

            <h2>${region.label}</h2>

            <p>
                Estrés: ${stress}
            </p>

            <p class="${color}">
                ${risk}
            </p>

        </div>
        `;

        container.innerHTML += card;

        let bodyPart =
            document.getElementById(
                region.id
            );

        if(bodyPart) {

            if(risk === "ALTO RIESGO") {

                bodyPart.style.background =
                    "red";

                bodyPart.style.boxShadow =
                    "0 0 30px red";
            }

            else if(
                risk ===
                "RIESGO MODERADO"
            ) {

                bodyPart.style.background =
                    "orange";

                bodyPart.style.boxShadow =
                    "0 0 30px orange";
            }

            else {

                bodyPart.style.background =
                    "deepskyblue";

                bodyPart.style.boxShadow =
                    "0 0 30px deepskyblue";
            }
        }
    });

    let stability =
        Math.max(
            0,
            100 -
            totalStress
            / simulationData.length
        );

    let bodyTilt =
        (50 - stability) / 8;

    let bodyOscillation =
        Math.sin(motionTime / 200)
        * (100 - stability) / 40;

    document
        .getElementById("bodyContainer")
        .style.transform =

        `
    rotate(${bodyTilt}deg)
    translateX(${bodyOscillation}px)
    `;

    applyJointMotion();

    let collapseRisk = "BAJO";

    if(stability < 40) {

        collapseRisk = "ALTO";
    }

    else if(stability < 70) {

        collapseRisk = "MODERADO";
    }

    document
        .getElementById("metrics")
        .innerHTML =

        `
    <div class="metricsCard">

        <h2>
            SYSTEM METRICS
        </h2>

        <p>
            Stability:
            ${stability.toFixed(1)}%
        </p>

        <p>
            Compensation:
            ${simulationMode}
        </p>

        <p>
            Strategy:
            ${strategy}
        </p>

        <p>
            Collapse Risk:
            ${collapseRisk}
        </p>

    </div>
    `;
}

function applyJointMotion() {

    let spine =
        simulationData.find(
            r => r.id === "spine"
        );

    let pelvis =
        simulationData.find(
            r => r.id === "pelvis"
        );

    let legs =
        simulationData.find(
            r => r.id === "legs"
        );

    let arms =
        simulationData.find(
            r => r.id === "arms"
        );

    let head =
        simulationData.find(
            r => r.id === "head"
        );

    let spineStress =
        spine.load
        - spine.compensation;

    let pelvisStress =
        pelvis.load
        - pelvis.compensation;

    let legsStress =
        legs.load
        - legs.compensation;

    let armsStress =
        arms.load
        - arms.compensation;

    let headStress =
        head.load
        - head.compensation;

    document
        .getElementById("spine")
        .style.transform =

        `
    rotate(${spineStress / 8}deg)
    `;

    document
        .getElementById("pelvis")
        .style.transform =

        `
    rotate(${pelvisStress / 10}deg)
    translateX(${pelvisStress / 4}px)
    `;

    document
        .getElementById("legs")
        .style.transform =

        `
    translateX(
        ${Math.sin(motionTime / 150)
        * legsStress / 10}px
    )
    `;

    document
        .getElementById("arms")
        .style.transform =

        `
    rotate(${-armsStress / 12}deg)
    `;

    document
        .getElementById("head")
        .style.transform =

        `
    translateX(
        ${Math.sin(motionTime / 120)
        * headStress / 12}px
    )
    `;
}

function startAutoCompensation() {

    clearInterval(autoInterval);

    autoInterval =
        setInterval(() => {

            let spine =
                simulationData.find(
                    r => r.id === "spine"
                );

            let pelvis =
                simulationData.find(
                    r => r.id === "pelvis"
                );

            let legs =
                simulationData.find(
                    r => r.id === "legs"
                );

            let arms =
                simulationData.find(
                    r => r.id === "arms"
                );

            let spineStress =
                spine.load
                - spine.compensation;

            if(strategy === "CONSERVATIVE") {

                if(spineStress > 80) {

                    pelvis.compensation += 2;

                    legs.compensation += 1;

                    arms.compensation += 1;
                }
            }

            else if(strategy === "AGGRESSIVE") {

                if(spineStress > 80) {

                    spine.compensation += 4;

                    pelvis.compensation += 4;

                    arms.load += 2;

                    legs.load += 2;
                }
            }

            simulationData.forEach(region => {

                if(region.compensation > 100) {

                    region.compensation = 100;
                }

                if(region.load > 150) {

                    region.load = 150;
                }
            });

            redrawDashboard();

        }, 1000);
}

function startTimeline() {

    clearInterval(timelineInterval);

    timelineInterval =
        setInterval(() => {

            if(!timelineRunning) {

                clearInterval(
                    timelineInterval
                );

                return;
            }

            motionTime += 100;

            simulationData.forEach(region => {

                region.load += 1;

                if(region.load > 150) {

                    region.load = 150;
                }
            });

            redrawDashboard();

        }, 1000);
}

document
    .getElementById("manualMode")
    .addEventListener("click", () => {

        simulationMode =
            "MANUAL";

        clearInterval(autoInterval);

        redrawDashboard();
    });

document
    .getElementById("conservativeMode")
    .addEventListener("click", () => {

        simulationMode =
            "AUTO";

        strategy =
            "CONSERVATIVE";

        startAutoCompensation();

        redrawDashboard();
    });

document
    .getElementById("aggressiveMode")
    .addEventListener("click", () => {

        simulationMode =
            "AUTO";

        strategy =
            "AGGRESSIVE";

        startAutoCompensation();

        redrawDashboard();
    });

document
    .getElementById("playTimeline")
    .addEventListener("click", () => {

        timelineRunning = true;
        if(simulationMode === "AUTO") {

            startAutoCompensation();
        }
        startTimeline();
    });

document
    .getElementById("pauseTimeline")
    .addEventListener("click", () => {

        timelineRunning = false;

        clearInterval(timelineInterval);

        clearInterval(autoInterval);
    });

document
    .getElementById("resetTimeline")
    .addEventListener("click", () => {

        timelineRunning = false;

        clearInterval(timelineInterval);

        motionTime = 0;

        simulationData.forEach(region => {

            region.compensation = 20;
        });

        redrawDashboard();
    });

loadSimulation();