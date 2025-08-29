import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { useForm, router } from '@inertiajs/react';

interface Student {
    id: number;
    name: string;
    student_id: string;
}

interface StudentClass {
    id: number;
    name: string;
    grade?: string;
    students: Student[];
}

interface ExistingAttendance {
    [studentId: number]: {
        id: number;
        status: string;
        notes?: string;
    };
}

interface Props {
    classes: StudentClass[];
    students: Student[];
    selectedDate: string;
    selectedClassId?: number;
    existingAttendance: ExistingAttendance;
    [key: string]: unknown;
}

type AttendanceFormData = {
    date: string;
    attendance: Array<{
        student_id: number;
        status: string;
        notes: string;
    }>;
}

const statusOptions = [
    { value: 'present', label: '✅ Present', color: 'bg-green-100 text-green-800' },
    { value: 'late', label: '⏰ Late', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'absent', label: '❌ Absent', color: 'bg-red-100 text-red-800' },
    { value: 'sick', label: '🤒 Sick', color: 'bg-blue-100 text-blue-800' },
    { value: 'permission', label: '🔐 Permission', color: 'bg-purple-100 text-purple-800' },
];

export default function CreateAttendance({ classes, students, selectedDate, selectedClassId, existingAttendance }: Props) {
    const [currentClassId, setCurrentClassId] = useState<number | null>(selectedClassId || null);
    const [currentStudents, setCurrentStudents] = useState<Student[]>(students);

    const { data, setData, post, processing, errors } = useForm<AttendanceFormData>({
        date: selectedDate,
        attendance: [],
    });

    // Initialize attendance data when students change
    useEffect(() => {
        if (currentStudents.length > 0) {
            const attendanceData = currentStudents.map(student => ({
                student_id: student.id,
                status: existingAttendance[student.id]?.status || 'present',
                notes: existingAttendance[student.id]?.notes || '',
            }));
            setData('attendance', attendanceData);
        }
    }, [currentStudents, existingAttendance]);

    const handleClassChange = (classId: number) => {
        setCurrentClassId(classId);
        const selectedClass = classes.find(c => c.id === classId);
        if (selectedClass) {
            setCurrentStudents(selectedClass.students);
            // Update URL to reflect class selection
            router.get('/attendance/create', {
                date: data.date,
                class_id: classId,
            }, {
                preserveState: true,
                replace: true,
            });
        }
    };

    const updateAttendance = (studentIndex: number, field: 'status' | 'notes', value: string) => {
        const updatedAttendance = [...data.attendance];
        updatedAttendance[studentIndex] = {
            ...updatedAttendance[studentIndex],
            [field]: value,
        };
        setData('attendance', updatedAttendance);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('attendance.store'));
    };

    const markAllAs = (status: string) => {
        const updatedAttendance = data.attendance.map(record => ({
            ...record,
            status: status,
        }));
        setData('attendance', updatedAttendance);
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📝 Mark Attendance</h1>
                        <p className="text-gray-600 mt-1">Record student attendance for your classes</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date and Class Selection */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={data.date}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                            </div>

                            <div>
                                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                                    Class
                                </label>
                                <select
                                    id="class"
                                    value={currentClassId || ''}
                                    onChange={(e) => handleClassChange(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Select a class</option>
                                    {classes.map((classItem) => (
                                        <option key={classItem.id} value={classItem.id}>
                                            {classItem.name} {classItem.grade && `(${classItem.grade})`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    {currentStudents.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => markAllAs(option.value)}
                                        className="text-xs"
                                    >
                                        Mark All {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student Attendance List */}
                    {currentStudents.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    👥 Students ({currentStudents.length})
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {currentStudents.map((student, index) => (
                                        <div key={student.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{student.name}</h4>
                                                <p className="text-sm text-gray-500">ID: {student.student_id}</p>
                                            </div>

                                            <div className="flex-1">
                                                <select
                                                    value={data.attendance[index]?.status || 'present'}
                                                    onChange={(e) => updateAttendance(index, 'status', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    {statusOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Notes (optional)"
                                                    value={data.attendance[index]?.notes || ''}
                                                    onChange={(e) => updateAttendance(index, 'notes', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    {currentStudents.length > 0 && (
                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => router.visit('/attendance')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : '💾 Save Attendance'}
                            </Button>
                        </div>
                    )}

                    {/* No Students Message */}
                    {currentClassId && currentStudents.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                            <p className="text-gray-600">The selected class doesn't have any students yet.</p>
                        </div>
                    )}

                    {/* Select Class Message */}
                    {!currentClassId && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
                            <p className="text-gray-600">Please select a class from the dropdown above to begin marking attendance.</p>
                        </div>
                    )}
                </form>
            </div>
        </AppShell>
    );
}