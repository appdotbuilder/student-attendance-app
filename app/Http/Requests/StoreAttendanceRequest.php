<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        if (!$user) {
            return false;
        }

        // Admin can mark attendance for any class
        if ($user->isAdmin()) {
            return true;
        }

        // Teachers can only mark attendance for their assigned classes
        if ($user->isTeacher()) {
            $studentIds = collect($this->input('attendance', []))->pluck('student_id');
            if ($studentIds->isEmpty()) {
                return false;
            }

            $students = \App\Models\Student::whereIn('id', $studentIds)->get();
            $classIds = $students->pluck('class_id')->unique();

            $userClassIds = $user->classes()->pluck('classes.id');
            
            return $classIds->every(fn($classId) => $userClassIds->contains($classId));
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'attendance' => 'required|array|min:1',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,permission,sick,late,absent',
            'attendance.*.notes' => 'nullable|string|max:500',
            'date' => 'required|date|before_or_equal:today',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attendance.required' => 'Attendance data is required.',
            'attendance.*.student_id.required' => 'Student is required.',
            'attendance.*.student_id.exists' => 'Invalid student selected.',
            'attendance.*.status.required' => 'Attendance status is required.',
            'attendance.*.status.in' => 'Invalid attendance status.',
            'date.required' => 'Date is required.',
            'date.before_or_equal' => 'Date cannot be in the future.',
        ];
    }
}