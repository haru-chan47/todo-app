
import { Container } from "react-bootstrap"
import AbyssReset from "./AbyssReset"
import DailyCommision from "./DailyCommision"
import Talent from "./Talent"
import WeeklyToDo from "./WeeklyToDo"

export default function TodoList() {
    return (
        <>
            <div>
                <AbyssReset />
                <h1 className="home-title">Todo List</h1>
                <Container>
                    <Talent />
                    <DailyCommision />
                    <WeeklyToDo />
                </Container>
            </div>
        </>
    )
}