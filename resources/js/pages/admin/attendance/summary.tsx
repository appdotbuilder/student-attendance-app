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

interface AttendanceRecord {
    id: number;
    date: string;
    status: string;
    notes?: string;
    student: Student;
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
    summary: Record<string, number>;
    classes: StudentClass[];
    filters: {
        date_from?: string;
        date_to?: string;
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

export default function AttendanceSummary({ attendances, summary, classes, filters, statusOptions }: Props) {
    const handleFilter = (field: string, value: string) => {
        router.get(route('attendance.summary'), {
            ...filters,
            [field]: value || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route('attendance.summary'));
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Attendance Summary</h1>
                        <p className="text-gray-600 mt-1">Comprehensive overview of student attendance patterns</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href="/attendance">
                            <Button variant="outline">View All Records</Button>
                        </Link>
                        <Link href="/attendance/create">
                            <Button>Mark Attendance</Button>
                        </Link>
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(statusOptions).map(([status, label]) => (
                        <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{label}</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {summary[status] || 0}
                                    </p>
                                </div>
                                <div className={`p-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
                                    <div className="w-3 h-3 rounded-full bg-current"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
                                From Date
                            </label>
                            <input
                                type="date"
                                id="date_from"
                                value={filters.date_from || ''}
                                onChange={(e) => handleFilter('date_from', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">
                                To Date
                            </label>
                            <input
                                type="date"
                                id="date_to"
                                value={filters.date_to || ''}
                                onChange={(e) => handleFilter('date_to', e.target.value)}
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

                {/* Detailed Records */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Detailed Records</h2>
                            <p className="text-sm text-gray-600">
                                Showing {attendances.data.length} of {attendances.total} records
                            </p>
                        </div>
                    </div>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* No results */}
                    {attendances.data.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                            <p className="text-gray-600">Try adjusting your filters or add new attendance records.</p>
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