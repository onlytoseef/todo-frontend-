"use client";

import { DeleteOutline, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { Box, Checkbox, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Todo } from '../../types';

interface Props {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onUpdate: (todo: Todo, title: string, description: string) => Promise<void>;
  onDelete: (todo: Todo) => Promise<void>;
}

export default function TodoCard({ todo, onToggle, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);

  return (
    <Box sx={{ border: '1px solid #e4e4dd', borderRadius: 3, p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1 }}>
          <Checkbox checked={todo.completed} onChange={() => onToggle(todo)} />
          {isEditing ? (
            <Stack width="100%" gap={1}>
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="small"
                fullWidth
              />
            </Stack>
          ) : (
            <Box>
              <Typography
                sx={{ textDecoration: todo.completed ? 'line-through' : 'none', fontWeight: 600 }}
              >
                {todo.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {todo.description || 'No description'}
              </Typography>
            </Box>
          )}
        </Stack>

        {isEditing ? (
          <IconButton onClick={async () => {
            await onUpdate(todo, title, description);
            setIsEditing(false);
          }}>
            <SaveOutlined />
          </IconButton>
        ) : (
          <IconButton onClick={() => setIsEditing(true)}>
            <EditOutlined />
          </IconButton>
        )}

        <IconButton color="error" onClick={() => onDelete(todo)}>
          <DeleteOutline />
        </IconButton>
      </Stack>
    </Box>
  );
}
