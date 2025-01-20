
import { Container } from "react-bootstrap"
import AbyssReset from "./AbyssReset"
import DailyCommision from "./DailyCommision"
import Talent from "./Talent"
import WeeklyToDo from "./WeeklyToDo"
import Weapon from "./Weapon"

export default function TodoList() {
    return (
        <>
            <div>
                <AbyssReset />

                <h1 className="home-title">Todo List</h1>
                <Container>
                    <Talent />
                    <Weapon />
                    <DailyCommision />
                    <WeeklyToDo />
                </Container>
            </div>
        </>
    )
}