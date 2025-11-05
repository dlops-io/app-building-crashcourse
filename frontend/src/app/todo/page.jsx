'use client'

import TodoComponent from '@/components/todo/Todo';

export default function TodoPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary font-montserrat">
                        Todo List
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Keep track of your tasks and stay organized
                    </p>
                </div>

                {/* Todo Component */}
                <TodoComponent />
            </div>
        </div>
    );
}