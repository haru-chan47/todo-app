
import DailyCommision from "./DailyCommision"
import Talent from "./Talent"
import WeeklyToDo from "./WeeklyToDo"

export default function TodoList() {
    return (
        <>
            <div>
                <Talent />
                <DailyCommision />
                <WeeklyToDo />
            </div>
        </>
    )
}