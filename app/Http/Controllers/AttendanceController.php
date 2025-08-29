<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\StudentClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Attendance::with(['student', 'student.class', 'markedBy']);

        // If teacher, only show attendance for their classes
        if ($user->isTeacher()) {
            $query->whereHas('student.class.teachers', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }

        // Apply filters
        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('class_id')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('class_id', $request->class_id);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->latest('date')->paginate(20);

        // Get classes for filter dropdown
        $classesQuery = StudentClass::orderBy('name');
        if ($user->isTeacher()) {
            $classesQuery->whereHas('teachers', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }
        $classes = $classesQuery->get();

        return Inertia::render('attendance/index', [
            'attendances' => $attendances,
            'classes' => $classes,
            'filters' => $request->only(['date', 'class_id', 'status']),
            'statusOptions' => [
                'present' => 'Present',
                'permission' => 'Permission',
                'sick' => 'Sick',
                'late' => 'Late',
                'absent' => 'Absent',
            ],
        ]);
    }

    /**
     * Show the form for marking attendance.
     */
    public function create(Request $request)
    {
        $user = auth()->user();
        $date = $request->get('date', today()->format('Y-m-d'));
        
        // Get available classes based on user role
        $classesQuery = StudentClass::with('students');
        if ($user->isTeacher()) {
            $classesQuery->whereHas('teachers', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }
        $classes = $classesQuery->orderBy('name')->get();

        $selectedClassId = $request->get('class_id');
        $students = collect();
        $existingAttendance = collect();

        if ($selectedClassId) {
            $selectedClass = $classes->firstWhere('id', $selectedClassId);
            if ($selectedClass) {
                $students = $selectedClass->students;
                
                // Get existing attendance for this date and class
                $existingAttendance = Attendance::whereDate('date', $date)
                    ->whereIn('student_id', $students->pluck('id'))
                    ->get()
                    ->keyBy('student_id');
            }
        }

        return Inertia::render('attendance/create', [
            'classes' => $classes,
            'students' => $students,
            'selectedDate' => $date,
            'selectedClassId' => $selectedClassId,
            'existingAttendance' => $existingAttendance,
        ]);
    }

    /**
     * Store attendance records.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $attendanceData = $request->validated();
        $date = $attendanceData['date'];
        $userId = auth()->id();

        foreach ($attendanceData['attendance'] as $record) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $record['student_id'],
                    'date' => $date,
                ],
                [
                    'status' => $record['status'],
                    'notes' => $record['notes'] ?? null,
                    'marked_by' => $userId,
                ]
            );
        }

        return redirect()->route('attendance.index')
            ->with('success', 'Attendance marked successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $query = Attendance::with(['student', 'student.class']);

        // Apply filters
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        if ($request->filled('class_id')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('class_id', $request->class_id);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Get summary statistics
        $summary = $query->clone()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $attendances = $query->latest('date')->paginate(20);
        $classes = StudentClass::orderBy('name')->get();

        return Inertia::render('admin/attendance/summary', [
            'attendances' => $attendances,
            'summary' => $summary,
            'classes' => $classes,
            'filters' => $request->only(['date_from', 'date_to', 'class_id', 'status']),
            'statusOptions' => [
                'present' => 'Present',
                'permission' => 'Permission',
                'sick' => 'Sick',
                'late' => 'Late',
                'absent' => 'Absent',
            ],
        ]);
    }
}