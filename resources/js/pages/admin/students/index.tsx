import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';

interface StudentClass {
    id: number;
    name: string;
    grade?: string;
}

interface Student {
    id: number;
    name: string;
    student_id: string;
    email?: string;
    phone?: string;
    class: StudentClass;
}

interface Props {
    students: {
        data: Student[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
    };
    classes: StudentClass[];
    filters: {
        class_id?: number;
        search?: string;
    };
    [key: string]: unknown;
}

export default function StudentsIndex({ students, classes, filters }: Props) {
    const handleFilter = (field: string, value: string) => {
        router.get(route('students.index'), {
            ...filters,
            [field]: value || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route('students.index'));
    };

    const handleDelete = (student: Student) => {
        if (confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
            router.delete(route('students.destroy', student.id));
        }
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">👥 Student Management</h1>
                        <p className="text-gray-600 mt-1">Manage students and assign them to classes</p>
                    </div>
                    <Link href="/students/create">
                        <Button className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Student</span>
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search
                            </label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search by name or student ID..."
                                value={filters.search || ''}
                                onChange={(e) => handleFilter('search', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="filter-class" className="block text-sm font-medium text-gray-700 mb-1">
                                Class
                            </label>
                            <select
                                id="filter-class"
                                value={filters.class_id || ''}
                                onChange={(e) => handleFilter('class_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Classes</option>
                                {classes.map((classItem) => (
                                    <option key={classItem.id} value={classItem.id}>
                                        {classItem.name} {classItem.grade && `(${classItem.grade})`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={clearFilters}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {students.data.length} of {students.total} students
                        </p>
                        {(filters.search || filters.class_id) && (
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-500">Filtered by:</span>
                                {filters.search && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Search: "{filters.search}"
                                    </span>
                                )}
                                {filters.class_id && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Class: {classes.find(c => c.id === Number(filters.class_id))?.name}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.data.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-900">{student.student_id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.class.name}</div>
                                            {student.class.grade && (
                                                <div className="text-sm text-gray-500">{student.class.grade}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {student.email && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                        </svg>
                                                        {student.email}
                                                    </div>
                                                )}
                                                {student.phone && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        {student.phone}
                                                    </div>
                                                )}
                                                {!student.email && !student.phone && (
                                                    <span className="text-gray-400">No contact info</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={route('students.show', student.id)}>
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link href={route('students.edit', student.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(student)}
                                                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* No results */}
                    {students.data.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                            <p className="text-gray-600 mb-4">
                                {filters.search || filters.class_id
                                    ? "Try adjusting your filters or add new students."
                                    : "Start by adding your first student."
                                }
                            </p>
                            <Link href="/students/create">
                                <Button>Add Student</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {students.last_page > 1 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing page {students.current_page} of {students.last_page}
                            </div>
                            <div className="flex space-x-2">
                                {students.links.map((link, index) => (
                                    link.url ? (
                                        <button
                                            key={index}
                                            onClick={() => router.visit(link.url!)}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-2 text-sm text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}