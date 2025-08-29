<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\StudentClass;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // Create teacher users
        $teachers = User::factory()->teacher()->count(3)->create();

        // Create classes
        $classes = StudentClass::factory()->count(5)->create();

        // Assign teachers to classes
        foreach ($teachers as $teacher) {
            $assignedClasses = $classes->random(random_int(1, 2));
            $teacher->classes()->attach($assignedClasses);
        }

        // Create students for each class
        foreach ($classes as $class) {
            $students = Student::factory()->count(random_int(15, 25))->create([
                'class_id' => $class->id,
            ]);

            // Create attendance records for the last 30 days
            $markers = collect([$admin])->merge($class->teachers);
            
            for ($i = 0; $i < 30; $i++) {
                $date = now()->subDays($i)->format('Y-m-d');
                
                foreach ($students as $student) {
                    // 80% chance of having attendance record
                    if (fake()->boolean(80)) {
                        $status = fake()->randomElement([
                            'present', 'present', 'present', 'present', // Higher weight for present
                            'late', 'absent', 'sick', 'permission'
                        ]);

                        Attendance::create([
                            'student_id' => $student->id,
                            'date' => $date,
                            'status' => $status,
                            'notes' => $status !== 'present' ? fake()->optional(0.5)->sentence() : null,
                            'marked_by' => $markers->random()->id,
                        ]);
                    }
                }
            }
        }
    }
}