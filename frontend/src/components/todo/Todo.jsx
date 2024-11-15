'use client'

import { useState } from 'react';
import { AddCircle, CheckBoxOutlineBlank, Delete, Edit } from '@mui/icons-material';

export default function Todo() {
    // Component States
    const [text, setText] = useState('');
    const [todos, setTodos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    // Handlers
    const handleAddTodo = () => {
        if (text.trim()) {
            setTodos([...todos, {
                id: Date.now(),
                text: text.trim(),
                completed: false
            }]);
            setText('');
        }
    }
    const handleDelete = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    }
    const handleEdit = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    }
    const handleSaveEdit = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: editText } : todo
        ));
        setEditingId(null);
        setEditText('');
    }
    const handleToggleComplete = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    }

    // UI View
    return (
        <div className="space-y-8">
            {/* Add Todo Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                        placeholder="Add a new todo..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleAddTodo}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <AddCircle />
                        Add
                    </button>
                </div>
            </div>

            {/* Todo List */}
            <div className="bg-white rounded-lg shadow-md">
                {todos.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No todos yet. Add some tasks to get started!
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {todos.map((todo) => (
                            <li key={todo.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleToggleComplete(todo.id)}
                                        className={`p-1 rounded-full transition-colors ${todo.completed ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'
                                            }`}
                                    >
                                        <CheckBoxOutlineBlank />
                                    </button>

                                    {editingId === todo.id ? (
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                                            className="flex-1 px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                            {todo.text}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-2">
                                        {editingId === todo.id ? (
                                            <button
                                                onClick={() => handleSaveEdit(todo.id)}
                                                className="p-1 text-green-500 hover:text-green-600 transition-colors"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(todo)}
                                                className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit fontSize="small" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(todo.id)}
                                            className="p-1 text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <Delete fontSize="small" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}