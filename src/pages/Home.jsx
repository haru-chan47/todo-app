import { Container } from "react-bootstrap";
import TodoList from "./TodoList";
import AbyssReset from "./AbyssReset";

export default function Home() {
    return (
        <Container>
            <AbyssReset />
            <h1 className="home-title">Todo List</h1>
            <div>
                <TodoList />
            </div>
        </Container>
    )
}