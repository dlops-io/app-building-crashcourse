'use client'

import { useState } from 'react';
import { PlusCircle, Trash2, Edit, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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
                    <Input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                        placeholder="Add a new todo..."
                        className="flex-1"
                    />
                    <Button
                        onClick={handleAddTodo}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Add
                    </Button>
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
                                    <Checkbox
                                        checked={todo.completed}
                                        onCheckedChange={() => handleToggleComplete(todo.id)}
                                        className="h-5 w-5"
                                    />

                                    {editingId === todo.id ? (
                                        <Input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                                            className="flex-1"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                            {todo.text}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-2">
                                        {editingId === todo.id ? (
                                            <Button
                                                onClick={() => handleSaveEdit(todo.id)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-green-500 hover:text-green-600"
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Save
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleEdit(todo)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-500 hover:text-blue-600"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleDelete(todo.id)}
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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