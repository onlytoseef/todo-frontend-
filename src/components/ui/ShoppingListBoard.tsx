"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiError } from "../../lib/api";
import { Todo } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store";
import { clearAuth } from "../../store/slices/authSlice";
import { clearAuthStorage } from "../../lib/storage";
import { useToast } from "./ToastProvider";
import SidebarArt from "./SidebarArt";
import LoadingSpinner from "./LoadingSpinner";

interface TodoItem {
  id: string;
  title: string;
  qty: number;
}

export default function ShoppingListBoard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { token, user, isHydrated } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [qty, setQty] = useState("14");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isFetchingTodos, setIsFetchingTodos] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const canLoadTodos = useMemo(() => isHydrated && Boolean(token && user), [isHydrated, token, user]);

  function mapBackendTodo(todo: Todo): TodoItem {
    const parsedQty = Number.parseInt(todo.description || "", 10);
    return {
      id: todo.id,
      title: todo.title,
      qty: Number.isInteger(parsedQty) && parsedQty > 0 ? parsedQty : 1,
    };
  }

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!token || !user) {
      router.push("/auth/login");
      return;
    }

    let alive = true;

    const loadTodos = async () => {
      setIsFetchingTodos(true);
      try {
        const data = await apiRequest<Todo[]>("/todos", {}, token);
        if (!alive) {
          return;
        }
        setTodos(data.map(mapBackendTodo));
      } catch (err) {
        if (!alive) {
          return;
        }
        const message = err instanceof ApiError ? err.message : "Failed to fetch todos.";
        toast.error(message);
      } finally {
        if (alive) {
          setIsFetchingTodos(false);
        }
      }
    };

    loadTodos();
    const intervalId = setInterval(loadTodos, 5000);

    return () => {
      alive = false;
      clearInterval(intervalId);
    };
  }, [isHydrated, router, token, toast, user]);

  async function onAddTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    const cleanTitle = title.trim();
    const parsedQty = Number(qty);

    if (!cleanTitle) {
      toast.warning("Please enter a title.");
      return;
    }

    if (!Number.isInteger(parsedQty) || parsedQty <= 0) {
      toast.warning("Please enter a valid positive number.");
      return;
    }

    try {
      setIsAdding(true);
      const created = await apiRequest<Todo>(
        "/todos",
        {
          method: "POST",
          body: JSON.stringify({
            title: cleanTitle,
            description: String(parsedQty),
          }),
        },
        token,
      );

      setTodos((prev) => [mapBackendTodo(created), ...prev]);
      setTitle("");
      setQty("14");
      toast.success("Item added.");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to add item.";
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  }

  async function onRemoveTodo(id: string) {
    if (!token) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    try {
      setRemovingId(id);
      await apiRequest<{ message: string }>(`/todos/${id}`, { method: "DELETE" }, token);
      setTodos((prev) => prev.filter((item) => item.id !== id));
      toast.info("Item removed.");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to remove item.";
      toast.error(message);
    } finally {
      setRemovingId(null);
    }
  }

  function onLogout() {
    clearAuthStorage();
    dispatch(clearAuth());
    toast.info("Logged out successfully.");
    router.push("/auth/login");
  }

  function onStartEdit(todo: TodoItem) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  function onCancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function onSaveEdit(todo: TodoItem) {
    if (!token) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    const cleanTitle = editingTitle.trim();
    if (!cleanTitle) {
      toast.warning("Title cannot be empty.");
      return;
    }

    try {
      setSavingId(todo.id);
      const updated = await apiRequest<Todo>(
        `/todos/${todo.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: cleanTitle,
            description: String(todo.qty),
          }),
        },
        token,
      );

      setTodos((prev) =>
        prev.map((item) =>
          item.id === todo.id
            ? {
                ...item,
                title: updated.title,
              }
            : item,
        ),
      );
      setEditingId(null);
      setEditingTitle("");
      toast.success("Item updated.");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to update item.";
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  }

  if (!canLoadTodos) {
    return null;
  }

  return (
    <main className="shopping-page">
      <SidebarArt />

      <section className="shopping-card">
        <button type="button" className="logout-btn" onClick={onLogout}>
          Logout
        </button>
        <h1>Shopping List</h1>

        <form className="shopping-form" onSubmit={onAddTodo}>
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="qty-input"
          />
          <button type="submit" className="add-btn" disabled={isAdding}>
            {isAdding ? (
              <span className="loading-label">
                <LoadingSpinner />
                Adding...
              </span>
            ) : (
              'Add'
            )}
          </button>
        </form>

        <ul className="shopping-list">
          {isFetchingTodos ? (
            <li className="list-loading">
              <LoadingSpinner />
              Loading todos...
            </li>
          ) : null}
          {todos.map((todo) => (
            <li key={todo.id} className="shopping-item">
              <span className="qty-badge">{todo.qty}</span>
              {editingId === todo.id ? (
                <>
                  <input
                    className="item-edit-input"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="save-btn"
                    disabled={savingId === todo.id}
                    onClick={() => onSaveEdit(todo)}
                  >
                    {savingId === todo.id ? (
                      <span className="loading-label">
                        <LoadingSpinner size="sm" />
                        Saving
                      </span>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button type="button" className="remove-btn" onClick={onCancelEdit} aria-label="Cancel edit">
                    ×
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="item-title item-title-btn"
                    onClick={() => onStartEdit(todo)}
                    aria-label={`Edit ${todo.title}`}
                  >
                    {todo.title}
                  </button>
                  <button
                    type="button"
                    className="remove-btn"
                    disabled={removingId === todo.id}
                    onClick={() => onRemoveTodo(todo.id)}
                    aria-label={`Remove ${todo.title}`}
                  >
                    {removingId === todo.id ? <LoadingSpinner size="sm" /> : '×'}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
