import { useEffect, useState } from 'react';

export default function AbyssReset() {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const calculateDaysLeft = () => {
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();
            const currentDay = today.getDate();

            let nextResetDate = new Date(currentYear, currentMonth, 16);

            if (currentDay > 16) { //resetting every 16th
                if (currentMonth === 11) { // December
                    nextResetDate = new Date(currentYear + 1, 0, 16); // January of next year
                } else {
                    nextResetDate = new Date(currentYear, currentMonth + 1, 16);
                }
            }

            const timeDifference = nextResetDate - today;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); //call calculateDaysLeft every 24 hours (24 hours * 60 minutes * 60 seconds * 1000 milliseconds).

            setDaysLeft(daysDifference);
        };

        calculateDaysLeft();

        const timer = setInterval(calculateDaysLeft, 24 * 60 * 60 * 1000); // Update the countdown every day

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="abyss-timer">
            <p><img src="/src/images/abyss.jpg" alt="Abyss Image" className="abyss-image" /></p>
            <div className="abyss-reset-timer">
                {daysLeft} days left before Abyss resets
            </div>
        </div >
    );
}