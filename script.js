const startDate = new Date(2024, 1, 19); // February 19, 2024
const endDate = new Date(2026, 7, 19); // August 19, 2026

const milestones = [
    { name: "Starting transition", date: new Date(2026, 8, 19) }
];

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("milestone1").textContent = milestones[0].date.toDateString();


    const countdownSection = document.getElementById("countdown");
    const progressBarContainer = document.createElement("div");
    progressBarContainer.id = "progress-container";

    const progressBar = document.createElement("div");
    progressBar.id = "progress-bar";

    progressBarContainer.appendChild(progressBar);
    countdownSection.appendChild(progressBarContainer);

    function updateProgress() {
        const now = new Date();

        let nextMilestone = null;
        for (let milestone of milestones) {
            if (milestone.date > now) {
                nextMilestone = milestone;
                break;
            }
        }

        if (nextMilestone) {
            const timeDiff = nextMilestone.date - now;
            const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
            document.getElementById("countdown-timer").textContent = 
                `Next: ${nextMilestone.name} in ${days} days!`;
        } else {
            document.getElementById("countdown-timer").textContent = "All milestones reached!";
        }

        const totalDuration = endDate - startDate;
        const elapsedTime = now - startDate;
        let progressPercent = (elapsedTime / totalDuration) * 100;
        progressPercent = Math.max(0, Math.min(progressPercent, 100)); // Ensure within 0-100%

        progressBar.style.width = progressPercent + "%";
    }

    setInterval(updateProgress, 1000);
    updateProgress();
});