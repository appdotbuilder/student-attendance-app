<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\StudentClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $totalStudents = Student::count();
            $totalClasses = StudentClass::count();
            $todayAttendance = Attendance::whereDate('date', today())->count();
            
            $todayAbsences = Attendance::whereDate('date', today())
                ->whereIn('status', ['absent', 'sick', 'late'])
                ->count();

            $recentAttendance = Attendance::with(['student', 'student.class', 'markedBy'])
                ->latest()
                ->take(10)
                ->get();

            return Inertia::render('admin/dashboard', [
                'stats' => [
                    'totalStudents' => $totalStudents,
                    'totalClasses' => $totalClasses,
                    'todayAttendance' => $todayAttendance,
                    'todayAbsences' => $todayAbsences,
                ],
                'recentAttendance' => $recentAttendance,
            ]);
        } elseif ($user->isTeacher()) {
            $classes = $user->classes()->withCount('students')->get();
            $totalStudents = $classes->sum('students_count');
            
            $todayAttendance = Attendance::whereDate('date', today())
                ->whereHas('student', function ($query) use ($user) {
                    $query->whereHas('class', function ($classQuery) use ($user) {
                        $classQuery->whereHas('teachers', function ($teacherQuery) use ($user) {
                            $teacherQuery->where('users.id', $user->id);
                        });
                    });
                })
                ->count();

            $recentAttendance = Attendance::with(['student', 'student.class'])
                ->whereHas('student', function ($query) use ($user) {
                    $query->whereHas('class', function ($classQuery) use ($user) {
                        $classQuery->whereHas('teachers', function ($teacherQuery) use ($user) {
                            $teacherQuery->where('users.id', $user->id);
                        });
                    });
                })
                ->latest()
                ->take(10)
                ->get();

            return Inertia::render('teacher/dashboard', [
                'stats' => [
                    'totalClasses' => $classes->count(),
                    'totalStudents' => $totalStudents,
                    'todayAttendance' => $todayAttendance,
                ],
                'classes' => $classes,
                'recentAttendance' => $recentAttendance,
            ]);
        }

        return redirect()->route('home');
    }


}