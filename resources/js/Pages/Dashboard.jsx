import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostsIndex from './Posts';
import { Head } from '@inertiajs/inertia-react';
import { Route, Routes } from 'react-router-dom';
import PostsCreate from './Posts/Create';

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout

            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Routes>
                                <Route path="/" element={<PostsIndex />}></Route>
                                <Route path="/posts/create" element={<PostsCreate />}></Route>
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
