import React, { createContext, useContext, useMemo, useReducer } from "react";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type State = {
  todos: Todo[];
};

type Action =
  | { type: "add"; title: string }
  | { type: "toggle"; id: string }
  | { type: "update"; id: string; title: string }
  | { type: "remove"; id: string }
  | { type: "clear-completed" };

type TodoContextValue = {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, title: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
};

const TodoContext = createContext<TodoContextValue | null>(null);

const initialState: State = {
  todos: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const trimmed = action.title.trim();
      if (!trimmed) return state;
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      };
      return { todos: [newTodo, ...state.todos] };
    }
    case "toggle":
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case "update": {
      const trimmed = action.title.trim();
      if (!trimmed) return state;
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, title: trimmed } : todo
        ),
      };
    }
    case "remove":
      return { todos: state.todos.filter((todo) => todo.id !== action.id) };
    case "clear-completed":
      return { todos: state.todos.filter((todo) => !todo.completed) };
    default:
      return state;
  }
}

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<TodoContextValue>(
    () => ({
      todos: state.todos,
      addTodo: (title) => dispatch({ type: "add", title }),
      toggleTodo: (id) => dispatch({ type: "toggle", id }),
      updateTodo: (id, title) => dispatch({ type: "update", id, title }),
      removeTodo: (id) => dispatch({ type: "remove", id }),
      clearCompleted: () => dispatch({ type: "clear-completed" }),
    }),
    [state.todos]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodos must be used within TodoProvider");
  }
  return ctx;
}
