import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';

interface Student {
    id: number;
    name: string;
    student_id: string;
    class: {
        id: number;
        name: string;
    };
}

interface MarkedBy {
    id: number;
    name: string;
}

interface AttendanceRecord {
    id: number;
    date: string;
    status: string;
    notes?: string;
    student: Student;
    marked_by: MarkedBy;
}

interface StudentClass {
    id: number;
    name: string;
    grade?: string;
}

interface Props {
    attendances: {
        data: AttendanceRecord[];
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
        date?: string;
        class_id?: number;
        status?: string;
    };
    statusOptions: Record<string, string>;
    [key: string]: unknown;
}

const statusColors = {
    present: 'bg-green-100 text-green-800',
    late: 'bg-yellow-100 text-yellow-800',
    absent: 'bg-red-100 text-red-800',
    sick: 'bg-blue-100 text-blue-800',
    permission: 'bg-purple-100 text-purple-800',
};

export default function AttendanceIndex({ attendances, classes, filters, statusOptions }: Props) {
    const handleFilter = (field: string, value: string) => {
        router.get(route('attendance.index'), {
            ...filters,
            [field]: value || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route('attendance.index'));
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Attendance Records</h1>
                        <p className="text-gray-600 mt-1">View and filter attendance records</p>
                    </div>
                    <Link href="/attendance/create">
                        <Button className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Mark Attendance</span>
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                id="filter-date"
                                value={filters.date || ''}
                                onChange={(e) => handleFilter('date', e.target.value)}
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

                        <div>
                            <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="filter-status"
                                value={filters.status || ''}
                                onChange={(e) => handleFilter('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Statuses</option>
                                {Object.entries(statusOptions).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
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
                            Showing {attendances.data.length} of {attendances.total} records
                        </p>
                        {(filters.date || filters.class_id || filters.status) && (
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-500">Filtered by:</span>
                                {filters.date && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Date: {new Date(filters.date).toLocaleDateString()}
                                    </span>
                                )}
                                {filters.class_id && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Class: {classes.find(c => c.id === Number(filters.class_id))?.name}
                                    </span>
                                )}
                                {filters.status && (
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                        Status: {statusOptions[filters.status]}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Notes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Marked By
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendances.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{record.student.name}</div>
                                                <div className="text-sm text-gray-500">ID: {record.student.student_id}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.student.class.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[record.status as keyof typeof statusColors]}`}>
                                                {statusOptions[record.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                            {record.notes ? (
                                                <div className="truncate" title={record.notes}>
                                                    {record.notes}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.marked_by.name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* No results */}
                    {attendances.data.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 3h10a2 2 0 012 2v14l-7-3-7 3V5a2 2 0 012-2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
                            <p className="text-gray-600 mb-4">
                                {filters.date || filters.class_id || filters.status
                                    ? "Try adjusting your filters or create new attendance records."
                                    : "Start by marking attendance for your classes."
                                }
                            </p>
                            <Link href="/attendance/create">
                                <Button>Mark Attendance</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {attendances.last_page > 1 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing page {attendances.current_page} of {attendances.last_page}
                            </div>
                            <div className="flex space-x-2">
                                {attendances.links.map((link, index) => (
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