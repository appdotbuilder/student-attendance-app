<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    // Redirect authenticated users to their dashboard
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect dashboard to role-specific dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Attendance routes - accessible by both admin and teachers
    Route::controller(AttendanceController::class)->group(function () {
        Route::get('attendance', 'index')->name('attendance.index');
        Route::get('attendance/create', 'create')->name('attendance.create');
        Route::post('attendance', 'store')->name('attendance.store');
        Route::get('attendance/summary', 'show')->name('attendance.summary');
    });

    // Admin only routes
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->group(function () {
        Route::resource('students', StudentController::class);
        Route::resource('classes', ClassController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';