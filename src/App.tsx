import { useMemo, useState, type FormEvent } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";

import { useTodos } from "./context/TodoContext";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

function App() {
  const { todos, addTodo, toggleTodo, updateTodo, removeTodo, clearCompleted } = useTodos();
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return { total: todos.length, completed };
  }, [todos]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
    setTitle("");
  };

  const startEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveEdit = (id: string) => {
    updateTodo(id, editingTitle);
    cancelEdit();
  };

  return (
    <main className="min-h-screen bg-muted/40 py-10">
      <div className="container max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-serif">Todo CRUD</CardTitle>
            <CardDescription className="text-bold font-mono text-sky-600">
              FN-45 Guruh <span className="text-orange-500 font-bold text-sm">Ikromov Solijon</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Yangi vazifa yozing..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <Button type="submit">Qo'shish</Button>
            </form>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>Jami: {stats.total}</span>
              <span>Bajarilgan: {stats.completed}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearCompleted}
                disabled={stats.completed === 0}
              >
                Bajarilganlarni tozalash
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Hali todo yo'q. Yangi todo qo'shing.
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card key={todo.id} className="transition hover:shadow-md">
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="mt-1"
                    />
                    {editingId === todo.id ? (
                      <Input
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") saveEdit(todo.id);
                          if (event.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p
                          className={
                            todo.completed
                              ? "line-through text-muted-foreground"
                              : "font-medium"
                          }
                        >
                          {todo.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(todo.createdAt).toLocaleDateString("uz-UZ")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editingId === todo.id ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => saveEdit(todo.id)}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Saqlash
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={cancelEdit}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Bekor
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(todo.id, todo.title)}
                        >
                          <Pencil className="mr-1 h-4 w-4" />
                          Tahrirlash
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTodo(todo.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          O'chirish
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
