<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'student_id' => 'required|string|max:50|unique:students,student_id',
            'class_id' => 'required|exists:classes,id',
            'date_of_birth' => 'nullable|date|before:today',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
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
            'name.required' => 'Student name is required.',
            'student_id.required' => 'Student ID is required.',
            'student_id.unique' => 'This student ID is already taken.',
            'class_id.required' => 'Please select a class.',
            'class_id.exists' => 'Selected class is invalid.',
            'date_of_birth.before' => 'Date of birth must be in the past.',
            'email.email' => 'Please provide a valid email address.',
        ];
    }
}