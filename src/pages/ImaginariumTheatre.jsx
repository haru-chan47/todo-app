import { useEffect, useState } from 'react';

export default function TheatreReset() {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const calculateDaysLeft = () => {
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();
            const currentDay = today.getDate();

            let nextResetDate = new Date(currentYear, currentMonth + 1, 1);

            if (currentDay === 1) {
                nextResetDate = new Date(currentYear, currentMonth + 1, 1);
            }

            const timeDifference = nextResetDate - today;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

            setDaysLeft(daysDifference);
        };

        calculateDaysLeft();

        const timer = setInterval(calculateDaysLeft, 24 * 60 * 60 * 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="theatre-timer">
            <p><img src="images/theatre.png" alt="Theatre Image" className="theatre-image img-fluid" /></p>
            <div className="theatre-reset-timer">
                <p className="mb-1">{daysLeft} days left before</p>
                <b className='mt-0'>Theatre resets</b>
            </div>
        </div>
    );
}
