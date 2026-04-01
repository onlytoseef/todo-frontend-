import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types';

interface TodoState {
  items: Todo[];
  loading: boolean;
}

const initialState: TodoState = {
  items: [],
  loading: false,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.items = action.payload;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.items.unshift(action.payload);
    },
    updateTodoInState(state, action: PayloadAction<Todo>) {
      state.items = state.items.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo,
      );
    },
    removeTodoFromState(state, action: PayloadAction<string>) {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    setTodoLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setTodos, addTodo, updateTodoInState, removeTodoFromState, setTodoLoading } =
  todoSlice.actions;
export default todoSlice.reducer;
