import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';

interface StudentClass {
    id: number;
    name: string;
    grade?: string;
}

interface Props {
    classes: StudentClass[];
    [key: string]: unknown;
}

type StudentFormData = {
    name: string;
    student_id: string;
    class_id: string;
    date_of_birth: string;
    email: string;
    phone: string;
    address: string;
}

export default function CreateStudent({ classes }: Props) {
    const { data, setData, post, processing, errors } = useForm<StudentFormData>({
        name: '',
        student_id: '',
        class_id: '',
        date_of_birth: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('students.store'));
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">➕ Add New Student</h1>
                        <p className="text-gray-600 mt-1">Create a new student profile and assign to a class</p>
                    </div>
                    <Link href="/students">
                        <Button variant="outline">
                            Back to Students
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Student ID */}
                            <div>
                                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Student ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="student_id"
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., STU2024001"
                                    required
                                />
                                {errors.student_id && <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>}
                            </div>

                            {/* Class */}
                            <div>
                                <label htmlFor="class_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Class <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="class_id"
                                    value={data.class_id}
                                    onChange={(e) => setData('class_id', e.target.value)}
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
                                {errors.class_id && <p className="mt-1 text-sm text-red-600">{errors.class_id}</p>}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    id="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.date_of_birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="student@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="+1 (555) 123-4567"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Home Address
                            </label>
                            <textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter full home address..."
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <Link href="/students">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : '💾 Create Student'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}