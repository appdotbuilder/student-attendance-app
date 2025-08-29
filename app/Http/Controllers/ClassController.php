<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClassRequest;
use App\Http\Requests\UpdateClassRequest;
use App\Models\StudentClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = StudentClass::withCount('students')
            ->with('teachers')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/classes/index', [
            'classes' => $classes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/classes/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClassRequest $request)
    {
        $class = StudentClass::create($request->validated());

        return redirect()->route('classes.index')
            ->with('success', 'Class created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentClass $class)
    {
        $class->load(['students', 'teachers']);

        return Inertia::render('admin/classes/show', [
            'class' => $class,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentClass $class)
    {
        return Inertia::render('admin/classes/edit', [
            'class' => $class,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassRequest $request, StudentClass $class)
    {
        $class->update($request->validated());

        return redirect()->route('classes.show', $class)
            ->with('success', 'Class updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentClass $class)
    {
        $class->delete();

        return redirect()->route('classes.index')
            ->with('success', 'Class deleted successfully.');
    }
}